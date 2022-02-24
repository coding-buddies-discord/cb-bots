import { Low, JSONFileSync } from "lowdb";
import set from "lodash";

const db = new Low(new JSONFileSync("db.json"));
await db.read()

const { points } = db.data



class PointsUser {
	constructor() {
		this.pointsGiven = [],
		this.pointsReceived = [],
		this.lastPointsGivenBy = []
	}
}

class PointsObject {
	constructor(giver, date, channel) {
		this.givenBy = giver,
		this.date = date,
		this.channel = channel
	}
}

export const addUserToPoints = (userId) => {
	if (Object.keys(points).includes(userId)) return;

	const user = userId
	const newUserObject = {}
	newUserObject[user] = new PointsUser;

  Object.assign(points, newUserObject)

	db.write();
};

export const giveUserAPoint =  (userId, interaction) => {
	const newPoint = new PointsObject(interaction.author.id, Date.now(), interaction.channel.name)

	const pointsArray = [...points[userId].pointsReceived, newPoint]

	const newObj = {...points[userId], pointsReceived: pointsArray}

	Object.assign(points[userId], newObj )

	db.write()
}

export const countGivenPoint = (userId) => {
// this needs to be an object with where the key becomes the channel and the value is a count.
// go get keys, check if channel is in key, if so add one to value, if not add it to object and set to zero
console.log('under construction')
}

