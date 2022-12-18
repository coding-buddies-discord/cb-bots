import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import {
  checkUserCache,
  addUserToCache,
  userCache,
} from '../src/utils/userCache.js';
import { SIMPLE_MODELS } from './SIMPLE_MODELS.js';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

const { DB_NAME, COLLECTION_NAME } = SIMPLE_MODELS;

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

export default class BuddiesModel {
  static async connectDb() {
    try {
      await client.connect();
      const db = client.db(DB_NAME);
      // collection name should be passed in, in the future
      const buddies = db.collection(COLLECTION_NAME);
      return buddies;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to connect to DB');
    }
  }

  static async addUserToPoints(userId) {
    const newUser = {};
    newUser._id = userId;
    Object.assign(newUser, new PointsUser());

    try {
      const inCache = checkUserCache(userId);

      if (inCache) {
        return false;
      }
      const db = await this.connectDb();
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
      const db = await this.connectDb();
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
      const db = await this.connectDb();
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
      const db = await this.connectDb();
      const user = await db.findOne({ _id: userId });
      const scoreTotal = user.pointsReceived.length;
      return { score, scoreTotal };
    } catch (error) {
      console.log(error);
    }
  }

  static async channelPoints(channelName, nameAmount = 1) {
    try {
      const db = await this.connectDb();
      const allUsers = await db.find().toArray();

      const listOfPoints = allUsers.map((user) => {
        const possiblePoints = user.pointsReceived.filter(
          ({ channel }) => channel === channelName
        );
        const userID = user._id;
        const points = possiblePoints.length;
        return { userID, points };
      });

      const sortedList = listOfPoints.sort((a, b) => b.points - a.points);
      return sortedList.slice(0, nameAmount);
    } catch (error) {
      console.log(error);
    }
  }

  static async populateUserCache(cache = userCache) {
    try {
      const db = await this.connectDb();
      const allUsers = await db.distinct('_id');
      allUsers.forEach((userID) => addUserToCache(userID));
      return cache;
    } catch (error) {
      console.log(error);
    }
  }

  static async getUser(id) {
    try {
      const db = await this.connectDb();
      const hello = await db.findOne({ _id: id });
      return hello;
    } catch (err) {
      console.log(err);
    }
  }
}
