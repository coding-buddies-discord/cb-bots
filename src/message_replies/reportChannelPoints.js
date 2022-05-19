import { channelPoints } from "../../db.js";
import { isUserValid } from "../utils/isUserValid.js";

const reportChannelPoints = async (interaction) => {
	const { channelId } = interaction;
	const topPointEarners = await channelPoints(channelId, 5);

	let currentChannelPoints = topPointEarners.length;


	if (currentChannelPoints === 0) return interaction.reply("There are no points in this channel yet, you should give someone one.😏");

	const validUsers = [];
	for (const { userID, points } of topPointEarners) {
		if (points === 0) continue;
		const { username, validUser } = await isUserValid(interaction, userID);
		if (validUser) validUsers.push({ username, points });
	}

	const message = validUsers.reduce((acc, { username, points }) => {
		return acc + `${username}: ${points} Points\n`;
	}, `<#${channelId}> **top ${validUsers.length}**:\n`);

	interaction.reply(message);
};

export default reportChannelPoints;
