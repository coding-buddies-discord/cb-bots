import { channelPoints } from "../../db.js";
import { isUserValid } from "../utils/isUserValid.js";
import { imgFromHtmlGenerator, generateBody } from "../image_templates/imgFromHtmlGenerator.js";
import { leaderBoardBody, styles } from "../image_templates/points.js"

const reportChannelPoints = async (interaction) => {
	const { channelId } = interaction;
	const topPointEarners = await channelPoints(channelId, 8);

	if (topPointEarners.length === 0) {
		return interaction.reply(
			"There are no points in this channel yet, you should give someone one.😏"
		);
	}

	const arrOfValidUsers = [];
	for (const { userID, points } of topPointEarners) {
		if (points === 0) continue;
		const { username, validUser, user } = await isUserValid(
			interaction,
			userID
		);
		if (validUser) {
			arrOfValidUsers.push({ username, points, user });
		}
	}

	const caller = interaction.author.username;
	const channelName = interaction.channel.name;
	const userListHTML = leaderBoardBody(channelName, caller, arrOfValidUsers);
	const body = generateBody(userListHTML, styles);

	const img = await imgFromHtmlGenerator(body)
	interaction.reply({

	 	files: [{ attachment: img }],
	 });
};

export default reportChannelPoints;
