import { LowSync, JSONFileSync } from "lowdb";
import fs from "fs";
// import set from "lodash";

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

// eslint-disable-next-line no-shadow
const createDbProps = (db) => {
	const serverProps = ["867244851098288149", "939629912623575090"];
	const featureProps = ["points", "example"];
	serverProps.forEach((prop) => {
		if (!db.data[prop]) {
			db.data[prop] = {};
		}
		featureProps.forEach((fprop) => {
			if (!db.data[prop][fprop]) {
				db.data[prop][fprop] = {};
			}
		});
	});
	console.log("added necessary server and feature props to db.json");
};

const checkDB = (path = "db.json") => {
	console.log("checking...");
	try {
		const dbExists = fs.existsSync(path);

		if (!dbExists) {
			fs.appendFileSync("db.json", "{}");
			console.log("db.json created");
		}
		if (fs.readFileSync(path).length === 0) {
			fs.appendFileSync("db.json", "{}");
			console.log("db.json was empty, added an empty object");
		}
		const database = new LowSync(new JSONFileSync("db.json"));
		database.read();
		createDbProps(database);
		database.write();
	}
	catch (err) {
		console.error(err);
	}
};

checkDB();


const db = new LowSync(new JSONFileSync("db.json"));
db.read();


export const addUserToPoints = (userId, guildId) => {
	// eslint-disable-next-line no-prototype-builtins
	const { points } = db.data[guildId];
	if (points.hasOwnProperty(userId)) return;

	const newUserObject = {};
	newUserObject[userId] = new PointsUser;
	Object.assign(points, newUserObject);

	db.write();
};

export const testDates = (userId, interaction) => {
	const { guildId } = interaction;
	const currentDate = Date.now();
	const { points } = db.data[guildId];
	let { lastPointsGivenBy } = points[userId];
	const newLastPointsGivenBy = lastPointsGivenBy.filter(({ date }) => {
		const pointDate = new Date(date);
		const dateComparison = currentDate - pointDate;
		return dateComparison < (1000 * 60);
	});
	// eslint-disable-next-line no-shadow
	const isValidPoint = newLastPointsGivenBy.every(({ userId }) => userId !== interaction.author.id);
	lastPointsGivenBy = newLastPointsGivenBy;
	db.write();
	return isValidPoint;
};

export const giveUserAPoint = (userId, interaction) => {
	const { guildId } = interaction;
	const { points } = db.data[guildId];
	const newPoint = new PointsObject(interaction.author.id, Date.now(), interaction.channelId);
	const newPointGivenBy = new PointGivenBy(interaction.author.id, Date.now());
	points[userId].pointsReceived.push(newPoint);
	points[userId].lastPointsGivenBy.push(newPointGivenBy);
	db.write();
};


export const countGivenPoint = (userId, messageChannel, guildId) => {
	const { points } = db.data[guildId];
	const pointsReceived = points[userId].pointsReceived.filter(({ channel }) => channel === messageChannel);
	return pointsReceived.length;
};

export const channelPoints = (channelName, nameAmount = 1, guildId) => {
	const { points } = db.data[guildId];
	const allUsers = Object.keys(points);
	const listOfPoints = allUsers.map(userID => {
		// eslint-disable-next-line no-shadow
		const points = countGivenPoint(userID, channelName, guildId);
		return { userID, points };
	});
	const sortedList = listOfPoints.sort((a, b) => b.points - a.points);
	return sortedList.slice(0, nameAmount);
};

