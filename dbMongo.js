import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://0.0.0.0:27017/");

const connectDB = async () => {
	try {
		await client.connect();
		const db = client.db("coding_buddies");
		const buddies = db.collection("buddies");
		return buddies;
	}
	catch (error) {
		console.log(error);
	}
};


class PointsUser {
	constructor() {
		this.pointsReceived = [],
			this.pointsGiven = [],
			this.lastPointsGivenBy = [];
	}
}

class PointsObject {
	constructor(giver, date, channel) {
		this.givenBy = giver,
			this.date = date,
			this.channel = channel;
	}
}

class PointGivenBy {
	constructor(userId, date) {
		this.userId = userId,
			this.date = date;
	}
}

export const addUserToPoints = async (userId) => {

	const newUser = {};
	newUser._id = userId;
	Object.assign(newUser, new PointsUser);

	try {
		const db = await connectDB();
		const foundUser = await db.findOne({ "_id": userId });
		if (foundUser) {
			return;
		}
		await db.insertOne(newUser);
	}
	catch (error) {
		console.log(error);
	}
};

export const testDates = async (userId, interaction) => {
	const currentDate = Date.now();
	try {
		const db = await connectDB();
		const user = await db.findOne({ _id: userId });
		let lastPointsGivenBy = user?.lastPointsGivenBy;

		const newLastPointsGivenBy = lastPointsGivenBy.filter(({ date }) => {
			const pointDate = new Date(date);
			const dateComparison = currentDate - pointDate;
			return dateComparison < (1000 * 60);
		});

		// eslint-disable-next-line no-shadow
		const isValidPoint = newLastPointsGivenBy.every(({ userId }) => userId !== interaction.author.id);
		lastPointsGivenBy = newLastPointsGivenBy;

		await db.updateOne({ _id: userId }, { $set: { lastPointsGivenBy: newLastPointsGivenBy } });
		return isValidPoint;

	}
	catch (error) {
		console.log(error);
	}
};

export const giveUserAPoint = async (userId, interaction) => {

	const newPoint = new PointsObject(interaction.author.id, Date.now(), interaction.channelId);
	const newPointGivenBy = new PointGivenBy(interaction.author.id, Date.now());

	try {
		const db = await connectDB();
		const user = await db.findOne({ _id: userId });

		if (!user) {
			addUserToPoints(userId);
		}

		user.pointsReceived.push(newPoint);
		user.lastPointsGivenBy.push(newPointGivenBy);
		await db.updateOne({ _id: userId }, { $set: { lastPointsGivenBy: user.lastPointsGivenBy, pointsReceived: user.pointsReceived } });
	}
	catch (error) {
		console.log(error);
	}
};


export const countGivenPoint = async (userId, messageChannel) => {
	try {
		const db = await connectDB();
		const user = await db.findOne({ _id: userId });
		const score = user.pointsReceived.filter(({ channel }) => channel === messageChannel);
		return score.length;
	}
	catch (error) {
		console.log(error);
	}
};

export const channelPoints = (channelName, nameAmount = 1) => {

	// const { points } = db.data;
	// const allUsers = Object.keys(points);
	// const listOfPoints = allUsers.map(userID => {
	// 	// eslint-disable-next-line no-shadow
	// 	const points = countGivenPoint(userID, channelName);
	// 	return { userID, points };
	// });
	// const sortedList = listOfPoints.sort((a, b) => b.points - a.points);
	// return sortedList.slice(0, nameAmount);
};

