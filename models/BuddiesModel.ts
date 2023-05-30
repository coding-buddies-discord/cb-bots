import {
  checkUserCache,
  addUserToCache,
  userCache,
} from '../src/utils/userCache.js';
import { connectDb } from '../src/utils/mongoUtils.js';
import { Message } from 'discord.js';

// class User {
// 	constructor(id) {
// 		this._id = id,
// 			this.timezone = null
// 	}
// }

export class PointsUser {
  constructor(
    public _id: string,
    public pointsReceived: PointsObject[] = [],
    public pointsGiven = [],
    public lastPointsGivenBy: PointGivenBy[] = []
  ) {}
}

class PointsObject {
  constructor(
    public givenBy: string,
    public date: number,
    public channel: string
  ) {}
}

class PointGivenBy {
  constructor(public userId: string, public date: number) {}
}

type userPoints = {
  _id: string;
  points: number;
  rank: number;
};

const { db } = await connectDb<PointsUser>();

export default class BuddiesModel {
  // NOTE: DONE
  static async addUserToPoints(userId: string) {
    try {
      const inCache = checkUserCache(userId);

      if (inCache) {
        return;
      }

      const foundUser = await db.findOne({ _id: userId });

      if (foundUser) {
        return;
      }

      await db.insertOne(new PointsUser(userId));
      addUserToCache(userId);
      return;
    } catch (error) {
      console.log(error);
      throw new Error('Point not able to be added');
    }
  }
  // NOTE: DONE
  static async testDates(userId: string, authorID: string): Promise<boolean> {
    try {
      const currentDate = Date.now();
      // finds the data from the user who's gonna receive the point
      const user = await db.findOne({ _id: userId });
      let { lastPointsGivenBy } = user;

      // no points and therefore one new can be given
      if (!lastPointsGivenBy.length) return true;

      // filters out dates that are more than 1min
      lastPointsGivenBy = lastPointsGivenBy.filter(({ date }) => {
        const pointDate = new Date(date).getTime();
        const dateComparison = currentDate - pointDate;
        return dateComparison < 1000 * 60;
      });

      // check if all points weren't gave by the current person
      const isValidPoint = lastPointsGivenBy.every(
        ({ userId }) => userId !== authorID
      );

      // updates with the new list with people who gave in less than 1min
      await db.updateOne(
        { _id: userId },
        { $set: { lastPointsGivenBy: lastPointsGivenBy } }
      );

      return isValidPoint;
    } catch (error) {
      console.log(error);
    }
  }
  // NOTE: DONE
  static async giveUserAPoint(userId: string, interaction: Message) {
    const newPoint = new PointsObject(
      interaction.author.id,
      Date.now(),
      interaction.channelId
    );
    const newPointGivenBy = new PointGivenBy(interaction.author.id, Date.now());

    try {
      let user = await db.findOne({ _id: userId });

      if (!user) {
        await this.addUserToPoints(userId);

        user = await db.findOne({ _id: userId });
      }

      user.pointsReceived.push(newPoint);
      user.lastPointsGivenBy.push(newPointGivenBy);

      await db.updateOne(
        { _id: userId },
        {
          $set: {
            lastPointsGivenBy: user.lastPointsGivenBy,
            pointsReceived: user.pointsReceived,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  static async countGivenPoint(userId: string, messageChannel: string) {
    try {
      const user = await db.findOne({ _id: userId });
      const score = user.pointsReceived.filter(
        ({ channel }) => channel === messageChannel
      ).length;

      const scoreTotal = user.pointsReceived.length;
      return { score, scoreTotal };
    } catch (error) {
      console.log(error);
    }
  }

  static async channelPoints(channelName: string, nameAmount = 8) {
    try {
      // Bellow are all necessary filters to call the db
      // rule to grab. here all docs who has at least one `pointsReceived.channel` will be grabbed;
      const matchRule = { $match: { 'pointsReceived.channel': channelName } };

      // will keep only those which `'pointsReceived.channel'` equals `channelName`;
      const channelFilter = {
        $project: {
          points: {
            $filter: {
              input: '$pointsReceived',
              as: 'pointObj',
              cond: { $eq: ['$$pointObj.channel', channelName] },
            },
          },
        },
      };
      // will grab the value of the array and put in the points property
      const totalPointsFilter = {
        $project: {
          points: {
            $size: '$points',
          },
        },
      };
      // will limit the final result by the name amount
      const limitFilter = { $limit: nameAmount };
      const rankFilter = {
        $setWindowFields: {
          // partitionBy: '$points',
          sortBy: { points: -1 },
          output: {
            rank: {
              $rank: {},
            },
          },
        },
      };

      // here we put the all the filters, and will return an array of objects
      // with the shape of `{_id: String, points: int, rank: int}`;
      return db
        .aggregate<userPoints>([
          matchRule,
          channelFilter,
          totalPointsFilter,
          rankFilter,
          limitFilter,
        ])
        .toArray();
    } catch (error) {
      console.log(error);
    }
  }

  // NOTE: consider join globalPints with channelPoints
  static async globalPoints(
    channelName: string,
    nameAmount = 8
  ): Promise<userPoints[]> {
    try {
      // Bellow are all necessary filters to call the db
      // rule to grab. here all docs who has at least one `pointsReceived.channel` will be grabbed;
      const matchRule = { $match: { 'pointsReceived.0': { $exists: true } } };
      // will keep only those which `'pointsReceived.channel'` equals `channelName`;
      // will grab the value of the array and put in the points property
      const totalPointsFilter = {
        $project: {
          points: {
            $size: '$pointsReceived',
          },
        },
      };
      // will limit the final result by the name amount
      const limitFilter = { $limit: nameAmount };
      const rankFilter = {
        $setWindowFields: {
          // partitionBy: '$points',
          sortBy: { points: -1 },
          output: {
            rank: {
              $rank: {},
            },
          },
        },
      };

      // here we put the all the filters, and will return an array of objects
      // with the shape of `{_id: String, points: int, rank: int}`;
      return await db
        .aggregate<userPoints>([
          matchRule,
          totalPointsFilter,
          rankFilter,
          limitFilter,
        ])
        .toArray();
    } catch (error) {
      console.log(error);
    }
  }

  // NOTE: done
  static async populateUserCache(cache = userCache) {
    try {
      const allUsers = await db.distinct('_id');
      allUsers.forEach((userID) => addUserToCache(userID));
      return cache;
    } catch (error) {
      console.log(error);
    }
  }
  // PERF:
  static async getUserGlobalPoints(_id: string) {
    try {
      // Bellow are all necessary filters to call the db
      // rule to grab. here all docs who has at least one `pointsReceived.channel` will be grabbed;
      const matchRule = { $match: { 'pointsReceived.0': { $exists: true } } };
      // will keep only those which `'pointsReceived.channel'` equals `channelName`;

      // will grab the value of the array and put in the points property
      const totalPointsFilter = {
        $project: {
          points: {
            $size: '$pointsReceived',
          },
        },
      };
      // will filter by who has the bigger amount of points

      const rankFilter = {
        $setWindowFields: {
          // partitionBy: '$points',
          sortBy: { points: -1 },
          output: {
            rank: {
              $rank: {},
            },
          },
        },
      };
      const userFilter = { $match: { _id: _id } };

      // here we put the all the filters, and will return an array of objects
      // with the shape of `{_id: String, points: int}`;
      const resultArr = await db
        .aggregate([matchRule, totalPointsFilter, rankFilter, userFilter])
        .toArray();

      if (!resultArr.length) {
        return { points: 0, rank: '#' };
      }

      return resultArr[0];
    } catch (error) {
      console.log(error);
    }
  }
  // PERF:
  static async getUserInfoOfChannel(_id: string, channelId: string) {
    try {
      // Bellow are all necessary filters to call the db
      // rule to grab. here all docs who has at least one `pointsReceived.channel` will be grabbed;
      const matchRule = { $match: { 'pointsReceived.channel': channelId } };
      // will keep only those which `'pointsReceived.channel'` equals `channelName`;
      const channelFilter = {
        $project: {
          points: {
            $filter: {
              input: '$pointsReceived',
              as: 'pointObj',
              cond: { $eq: ['$$pointObj.channel', channelId] },
            },
          },
        },
      };
      // will grab the value of the array and put in the points property
      const totalPointsFilter = {
        $project: {
          points: {
            $size: '$points',
          },
        },
      };
      // will filter by who has the bigger amount of points

      const rankFilter = {
        $setWindowFields: {
          // partitionBy: '$points',
          sortBy: { points: -1 },
          output: {
            rank: {
              $rank: {},
            },
          },
        },
      };
      const userFilter = { $match: { _id: _id } };

      // here we put the all the filters, and will return an array of objects
      // with the shape of `{_id: String, points: int}`;
      const resultArr = await db
        .aggregate([
          matchRule,
          channelFilter,
          totalPointsFilter,
          rankFilter,
          userFilter,
        ])
        .toArray();

      if (!resultArr.length) {
        return { points: 0, rank: '#' };
      }

      return resultArr[0];
    } catch (error) {
      console.log(error);
    }
  }
}
