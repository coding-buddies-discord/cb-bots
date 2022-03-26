import { LowSync, JSONFileSync } from "lowdb";
import fs from "fs";
import client from "./src/index.js";
// import set from "lodash";

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

// eslint-disable-next-line no-shadow
const createDbProps = (db) => {
	// to add: "lastInteractionDate" if "userActivity is implemented";
	const props = ["points", "example"];
	for (const prop of props) {
		const isInDB = prop in db.data;
		if (!isInDB) {
			db.data[prop] = {};
		}
	}
	console.log("added necessary props to db.json");
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
	} catch (err) {
		console.error(err);
	}
};

checkDB();

const db = new LowSync(new JSONFileSync("db.json"));
db.read();

export const addUserToPoints = (userId) => {
	// eslint-disable-next-line no-prototype-builtins
	const { points } = db.data;
	if (points.hasOwnProperty(userId)) return;

	const newUserObject = {};
	newUserObject[userId] = new PointsUser();
	Object.assign(points, newUserObject);

	db.write();
};

export const testDates = (userId, interaction) => {
	const currentDate = Date.now();
	const { points } = db.data;
	let { lastPointsGivenBy } = points[userId];
	const newLastPointsGivenBy = lastPointsGivenBy.filter(({ date }) => {
		const pointDate = new Date(date);
		const dateComparison = currentDate - pointDate;
		return dateComparison < 1000 * 60;
	});
	// eslint-disable-next-line no-shadow
	const isValidPoint = newLastPointsGivenBy.every(
		({ userId }) => userId !== interaction.author.id
	);
	lastPointsGivenBy = newLastPointsGivenBy;
	db.write();
	return isValidPoint;
};

export const giveUserAPoint = (userId, interaction) => {
	const { points } = db.data;
	const newPoint = new PointsObject(
		interaction.author.id,
		Date.now(),
		interaction.channelId
	);
	const newPointGivenBy = new PointGivenBy(interaction.author.id, Date.now());
	points[userId].pointsReceived.push(newPoint);
	points[userId].lastPointsGivenBy.push(newPointGivenBy);
	db.write();
};

export const countGivenPoint = (userId, messageChannel) => {
	const { points } = db.data;
	const pointsReceived = points[userId].pointsReceived.filter(
		({ channel }) => channel === messageChannel
	);
	return pointsReceived.length;
};

export const channelPoints = (channelName, nameAmount = 1) => {
	const { points } = db.data;
	const allUsers = Object.keys(points);
	const listOfPoints = allUsers.map((userID) => {
		// eslint-disable-next-line no-shadow
		const points = countGivenPoint(userID, channelName);
		return { userID, points };
	});
	const sortedList = listOfPoints.sort((a, b) => b.points - a.points);
	return sortedList.slice(0, nameAmount);
};

/* Last Interaction */

export const getLastInteraction = (userID) => {
	const { lastInteractionDate } = db.data;
	const userLastInteraction = lastInteractionDate[userID];
	return userLastInteraction;
};

export const addLatestInteraction = (userID) => {
	//to add at each interaction of users;
	const { lastInteractionDate } = db.data;
	lastInteractionDate[userID] = Date.now();
	db.write();
};

export const compareDates = (date, difference) => {
	const currentDate = new Date();
	const dateComparison = currentDate - date;
	return dateComparison < difference;
};

export const userActivity = async () => {
	//const client = await import('./src/index.js')
	// in sequence: day  hour minutes seconds milisseconds
	const month = 30 * 24 * 60 * 60 * 1000;
	const { lastInteractionDate } = db.data;
	for (const id in lastInteractionDate) {
		const interactionDate = getLastInteraction(id);
		const isMonthOld = compareDates(interactionDate, month);
		const isTwoMonthOld = compareDates(interactionDate, month * 2);
		//implement what to do at each month
		if (isMonthOld) {
			/*
			should add the DM for the user. bellow is my atempt to make it work:

			const user = await client.users.fetch('870622678329983056');
			await user.send('message')
			const a = await client.users.createDM(b , "hi")
*/
		} else if (isTwoMonthOld) {
			//remove the user from the server if is 2 months without interaction;
		} else {
			// if necessary, put something here;
		}
	}
};
