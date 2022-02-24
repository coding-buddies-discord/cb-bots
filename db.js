import { Low, JSONFileSync } from "lowdb";
//import set from "lodash";

const db = new Low(new JSONFileSync("db.json"));
await db.read()
const { points } = db.data

class PointsUser {
	constructor() {
		this.pointsReceived = [],
		this.pointsGiven = [],
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

class PointGivenBy {
	constructor(userID, date) {
		this.userId = userId,
		this.date = date
	}
}

export const addUserToPoints = (userId) => {
	if (points.hasOwnProperty(userId)) return;
	
	const newUserObject = {}
	newUserObject[userId] = new PointsUser;
  	Object.assign(points, newUserObject)

	db.write();
};


export const giveUserAPoint =  (userId, interaction) => {
	const newPoint = new PointsObject(interaction.author.id, Date.now(), interaction.channel.name);
	const newPointGivenBy = new PointsObject(interaction.author.id, Date.now());
	points[userId].pointsReceived.push(newPoint);
	points[userId].lastPointsGivenBy.push(newPointGivenBy);


	db.write()
}





export const countGivenPoint = (userId) => {
// this needs to be an object with where the key becomes the channel and the value is a count.
// go get keys, check if channel is in key, if so add one to value, if not add it to object and set to zero
console.log('under construction')
}

