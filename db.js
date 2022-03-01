import { LowSync, JSONFileSync } from "lowdb";
import fs from "fs";
// import set from "lodash";

const db = new LowSync(new JSONFileSync("db.json"));
db.read();

const { points } = db.data;

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

const createDbProps = (db) => {
	const props = ["points", "example"];
	for (const prop of props) {
		const isInDB = prop in db.data;
		if (!isInDB) {
			db.data[prop] = {};
		}
	}
	console.log("added necessary props to db.json")
};

const checkDB = (database = db, path="db.json") => {
	console.log("checking...");
	try {
		const dbExists = fs.existsSync(path);
		if (!dbExists) {
			fs.appendFileSync("db.json", "{}");
			console.log("db.json created")
		}
		if (fs.readFileSync(path).length === 0) {
			fs.appendFileSync("db.json", "{}");
			console.log("db.json was empty, added an empty object")
		}
		createDbProps(database);
		database.write();
	} catch (err) {
		console.error(err);
	}
};






export const addUserToPoints = (userId) => {
	// eslint-disable-next-line no-prototype-builtins
	if (points.hasOwnProperty(userId)) return;

	const newUserObject = {};
	newUserObject[userId] = new PointsUser;
	Object.assign(points, newUserObject);

	db.write();
};

export const testDates = (userId, interaction) => {
	const currentDate = Date.now();
	let { lastPointsGivenBy } = points[userId];
	const newLastPointsGivenBy = lastPointsGivenBy.filter(({ date }) => {
		const pointDate = new Date(date);
		const dateComparison = currentDate - pointDate;
		return dateComparison <	 (1000 * 60);
	});
	const isValidPoint = newLastPointsGivenBy.every(({ givenBy }) => givenBy !== interaction.author.id);
	lastPointsGivenBy = newLastPointsGivenBy;
	db.write();
	return isValidPoint;
};


export const giveUserAPoint = (userId, interaction) => {
	const newPoint = new PointsObject(interaction.author.id, Date.now(), interaction.channel.name);
	const newPointGivenBy = new PointGivenBy(interaction.author.id, Date.now());
	points[userId].pointsReceived.push(newPoint);
	points[userId].lastPointsGivenBy.push(newPointGivenBy);
	db.write();
};


export const countGivenPoint = (userId, messageChannel) => {
	const pointsReceived = points[userId].pointsReceived.filter(({ channel }) => channel === messageChannel);
	return pointsReceived.length;
};

export const channelPoints = (channelName, nameAmount = 1) => {
	const allUsers = Object.keys(points);
	const listOfPoints = allUsers.map(userID => {
		const points = countGivenPoint(userID, channelName);
		return {userID, points}
	})
	const sortedList = listOfPoints.sort((a, b) => b.points -a.points)
	return sortedList.slice(0,nameAmount);
}



checkDB()