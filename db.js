import { LowSync, JSONFileSync } from "lowdb";
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

// class PointGivenBy {
// 	constructor(userId, date) {
// 		this.userId = userId,
// 		this.date = date;
// 	}
// }

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
	const newPointGivenBy = new PointsObject(interaction.author.id, Date.now());
	points[userId].pointsReceived.push(newPoint);
	points[userId].lastPointsGivenBy.push(newPointGivenBy);
	db.write();
};


export const countGivenPoint = (userId, messageChannel) => {
	const pointsReceived = points[userId].pointsReceived.filter(({ channel }) => channel === messageChannel);
	return pointsReceived.length;
};

