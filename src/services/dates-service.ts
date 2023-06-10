import { User } from "discord.js";

export async function testDates(userId: User["id"], authorID: User["id"]): Promise<boolean> {
	try {
		const currentDate = Date.now();
		// finds the data from the user who's gonna receive the point
		const user = await collection.findOne({ _id: userId });
		let { lastPointsGivenBy } = user;

		// no points and therefore one new can be given
		if(!lastPointsGivenBy.length) return true;

		// filters out dates that are more than 1min
		lastPointsGivenBy = lastPointsGivenBy
			.filter(({ date }) => {
				const pointDate = new Date(date).getTime();
				const dateComparison = currentDate - pointDate;
				return dateComparison < 1000 * 60;
			});

		// check if all points weren't gave by the current person
		const isValidPoint = lastPointsGivenBy
			.every(({ userId }) => userId !== authorID);

		// updates with the new list with people who gave in less than 1min
		await collection
			.updateOne(
				{ _id: userId },
				{ $set: { lastPointsGivenBy: lastPointsGivenBy } }
			);

		return isValidPoint;
	} catch(error) {
		console.log(error);
	}
}
