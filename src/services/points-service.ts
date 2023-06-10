import { Message } from "discord.js";
import { UserPoints } from "../models/UserPoints";
import { addUserToCache, checkUserCache } from "../user-cache";

export async function addUserToPoints(userId: string) {
	try {
		const inCache = checkUserCache(userId);

		if(inCache) return;

		const foundUser = await collection.findOne({ _id: userId });

		if(foundUser) return;

		return collection
			.insertOne(new PointsUser(userId))
			.then(_ => addUserToCache(userId));
	} catch(error) {
		console.log(error);
		throw new Error("Point not able to be added");
	}
}


export async function giveUserAPoint(userId: string, interaction: Message) {
	const newPoint = new PointsObject(interaction.author.id, Date.now(), interaction.channelId);
	const newPointGivenBy = new PointGivenBy(interaction.author.id, Date.now());

	try {
		let user = await collection.findOne({ _id: userId });

		if(!user) {
			await this.addUserToPoints(userId);
			user = await collection.findOne({ _id: userId });
		}

		user.pointsReceived.push(newPoint);
		user.lastPointsGivenBy.push(newPointGivenBy);

		await collection.updateOne(
			{ _id: userId },
			{
				$set: {
					lastPointsGivenBy: user.lastPointsGivenBy,
					pointsReceived: user.pointsReceived,
				},
			}
		);
	} catch(error) {
		console.log(error);
	}
}

export async function countGivenPoint(userId: string, messageChannel: string) {
	try {
		const user = await collection.findOne({ _id: userId });
		const score = user
			.pointsReceived
			.filter(({ channel }) => channel === messageChannel)
			.length;

		const scoreTotal = user.pointsReceived.length;
		return { score, scoreTotal };
	} catch(error) {
		console.log(error);
	}
}

export async function channelPoints(channelName: string, nameAmount = 8) {
	try {
		// Bellow are all necessary filters to call the db
		// rule to grab. here all docs who has at least one `pointsReceived.channel` will be grabbed;
		const matchRule = { $match: { "pointsReceived.channel": channelName } };

		// will keep only those which `"pointsReceived.channel"` equals `channelName`;
		const channelFilter = {
			$project: {
				points: {
					$filter: {
						input: "$pointsReceived",
						as: "pointObj",
						cond: { $eq: ["$$pointObj.channel", channelName] },
					},
				},
			},
		};
		// will grab the value of the array and put in the points property
		const totalPointsFilter = {
			$project: {
				points: {
					$size: "$points",
				},
			},
		};
		// will limit the final result by the name amount
		const limitFilter = { $limit: nameAmount };
		const rankFilter = {
			$setWindowFields: {
				// partitionBy: "$points",
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
		return collection
			.aggregate<UserPoints>([
				matchRule,
				channelFilter,
				totalPointsFilter,
				rankFilter,
				limitFilter,
			])
			.toArray();
	} catch(error) {
		console.log(error);
	}
}

// NOTE: consider join globalPints with channelPoints
export async function globalPoints(channelName: string, nameAmount = 8): Promise<UserPoints[]> {
	try {
		// Bellow are all necessary filters to call the db
		// rule to grab. here all docs who has at least one `pointsReceived.channel` will be grabbed;
		const matchRule = { $match: { "pointsReceived.0": { $exists: true } } };
		// will keep only those which `"pointsReceived.channel"` equals `channelName`;
		// will grab the value of the array and put in the points property
		const totalPointsFilter = {
			$project: {
				points: {
					$size: "$pointsReceived",
				},
			},
		};
		// will limit the final result by the name amount
		const limitFilter = { $limit: nameAmount };
		const rankFilter = {
			$setWindowFields: {
				// partitionBy: "$points",
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
		return await collection
			.aggregate<UserPoints>([
				matchRule,
				totalPointsFilter,
				rankFilter,
				limitFilter,
			])
			.toArray();
	} catch(error) {
		console.log(error);
	}
};

// PERF:
export async function getUserGlobalPoints(_id: string) {
	try {
		// Bellow are all necessary filters to call the db
		// rule to grab. here all docs who has at least one `pointsReceived.channel` will be grabbed;
		const matchRule = { $match: { "pointsReceived.0": { $exists: true } } };
		// will keep only those which `"pointsReceived.channel"` equals `channelName`;

		// will grab the value of the array and put in the points property
		const totalPointsFilter = {
			$project: {
				points: {
					$size: "$pointsReceived",
				},
			},
		};
		// will filter by who has the bigger amount of points

		const rankFilter = {
			$setWindowFields: {
				// partitionBy: "$points",
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
		const resultArr = await collection
			.aggregate([matchRule, totalPointsFilter, rankFilter, userFilter])
			.toArray();

		if(!resultArr.length) return { points: 0, rank: "#" };

		return resultArr[0];
	} catch(error) {
		console.log(error);
	}
}
