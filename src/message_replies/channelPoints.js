import { channelPoints } from "../../db.js";
import { isUserValid } from "../utils/isUserValid.js";

const channelPointsMessage = async (interaction) => {
	const channelName = interaction.channel.name;
	const top5 = channelPoints(channelName, 5);
	let message = `Those are the top 5 on **${channelName}**:\n`;
	for (const { userID, points } of top5) {
		const { username } = await isUserValid(interaction, userID);
		message += `${username}: ${points} Points\n`;
	}

	interaction.reply(message);
};

export default channelPointsMessage;
