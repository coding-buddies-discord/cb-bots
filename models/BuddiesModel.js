import {
  checkUserCache,
  addUserToCache,
  userCache,
} from '../src/utils/userCache.js';
import { connectDb } from '../src/utils/mongoUtils.js';

// class User {
// 	constructor(id) {
// 		this._id = id,
// 			this.timezone = null
// 	}
// }

class PointsUser {
  constructor() {
    (this.pointsReceived = []),
      (this.pointsGiven = []),
      (this.lastPointsGivenBy = []);
  }
}

class PointsObject {
  constructor(giver, date, channel) {
    (this.givenBy = giver), (this.date = date), (this.channel = channel);
  }
}

class PointGivenBy {
  constructor(userId, date) {
    (this.userId = userId), (this.date = date);
  }
}

const { db } = await connectDb();

export default class BuddiesModel {
  // NOTE: this method doesn't make sense to me. It returns false or nothing inconsistently
  static async addUserToPoints(userId) {
    const newUser = {};
    newUser._id = userId;
    Object.assign(newUser, new PointsUser());

    try {
      const inCache = checkUserCache(userId);

      if (inCache) {
        return false;
      }

      const foundUser = await db.findOne({ _id: userId });

      if (foundUser) {
        return;
      }

      await db.insertOne(newUser);
      addUserToCache(userId);
      return true;
    } catch (error) {
      console.log(error);
      throw new Error('Point not able to be added');
    }
  }

  static async testDates(userId, interaction) {
    const currentDate = Date.now();
    try {
      const user = await db.findOne({ _id: userId });
      let lastPointsGivenBy = user?.lastPointsGivenBy;

      if (!lastPointsGivenBy) {
        return true;
      }

      const newLastPointsGivenBy = lastPointsGivenBy.filter(({ date }) => {
        const pointDate = new Date(date);
        const dateComparison = currentDate - pointDate;
        return dateComparison < 1000 * 60;
      });

      const isValidPoint = newLastPointsGivenBy.every(
        // eslint-disable-next-line no-shadow
        ({ userId }) => userId !== interaction.author.id
      );
      lastPointsGivenBy = newLastPointsGivenBy;

      await db.updateOne(
        { _id: userId },
        { $set: { lastPointsGivenBy: newLastPointsGivenBy } }
      );
      return isValidPoint;
    } catch (error) {
      console.log(error);
    }
  }

  static async giveUserAPoint(userId, interaction) {
    const newPoint = new PointsObject(
      interaction.author.id,
      Date.now(),
      interaction.channelId
    );
    const newPointGivenBy = new PointGivenBy(interaction.author.id, Date.now());

    try {
      // NOTE: we should check cache first to avoid a db hit if we can
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

  static async countGivenPoint(userId, messageChannel) {
    try {
      const score = user.pointsReceived.filter(
        ({ channel }) => channel === messageChannel
      ).length;
      const user = await db.findOne({ _id: userId });
      const scoreTotal = user.pointsReceived.length;
      return { score, scoreTotal };
    } catch (error) {
      console.log(error);
    }
  }

  static async channelPoints(channelName, nameAmount = 8) {
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
        .aggregate([
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

  static async globalPoints(channelName, nameAmount = 8) {
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
        .aggregate([matchRule, totalPointsFilter, rankFilter, limitFilter])
        .toArray();
    } catch (error) {
      console.log(error);
    }
  }

  static async populateUserCache(cache = userCache) {
    try {
      const allUsers = await db.distinct('_id');
      allUsers.forEach((userID) => addUserToCache(userID));
      return cache;
    } catch (error) {
      console.log(error);
    }
  }

  static async getUserGlobalPoints(_id) {
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

  static async getUserInfoOfChannel(_id, channelId) {
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
