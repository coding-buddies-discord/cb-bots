import { Low, JSONFileSync } from "lowdb";
import set from "lodash";

const db = new Low(new JSONFileSync("db.json"));
await db.read()

const { points } = db.data



class PointsUser {
	constructor() {
		this.pointsGiven = 0,
		this.pointsReceived = 0,
		this.lastPointsGivenBy = [],
		this.channels = [];
	}
}

export const addUserToPoints = (event) => {
	if (Object.keys(points).includes(event.user.id)) return;

	const user = event.user.id
	const newUserObject = {}
	newUserObject[user] = new PointsUser;

  Object.assign(points, newUserObject)

	db.write();
};

