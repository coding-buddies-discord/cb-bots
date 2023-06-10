import { connectDb } from "../database";
import { PointsUser } from "./PointsUser";

const { collection } = await connectDb<PointsUser>();

export class BuddiesModel {
	// PERF:
	static async getUserInfoOfChannel(_id: string, channelId: string) {
		try {
			// Bellow are all necessary filters to call the db
			// rule to grab. here all docs who has at least one `pointsReceived.channel` will be grabbed;
			const matchRule = { $match: { "pointsReceived.channel": channelId } };
			// will keep only those which `"pointsReceived.channel"` equals `channelName`;
			const channelFilter = {
				$project: {
					points: {
						$filter: {
							input: "$pointsReceived",
							as: "pointObj",
							cond: { $eq: ["$$pointObj.channel", channelId] },
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
				.aggregate([
					matchRule,
					channelFilter,
					totalPointsFilter,
					rankFilter,
					userFilter,
				])
				.toArray();

			if(!resultArr.length) return { points: 0, rank: "#" };

			return resultArr[0];
		} catch(error) {
			console.log(error);
		}
	}
}
