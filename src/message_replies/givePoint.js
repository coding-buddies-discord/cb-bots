import { getUserIdFromMention } from "../utils/getUserIdFromMention.js";
import { isUserValid } from "../utils/isUserValid.js";
import {
	addUserToPoints,
	giveUserAPoint,
	countGivenPoint,
	testDates,
} from "../../dbMongo.js";

async function givePoint(command, interaction) {
	const mentionId = getUserIdFromMention(command);

	if (!mentionId) return interaction.reply(`Sorry <@!${interaction.author.id}>, can't find ${command}.\n(╯°□°）╯︵ ┻━┻`);

	const { validUser } = await isUserValid(interaction, mentionId);

	// TODO: this donesn't wonk
	if (!validUser) {
		interaction.channel.send(
			// eslint-disable-next-line no-useless-escape
			`Sorry <@!${interaction.author.id}>, idk who ${command} is. ¯\\_(ツ)_/¯`,
		);
	}
	else if (interaction.author.id === mentionId) {
		interaction.channel.send(
			`Lmao <@!${interaction.author.id}>, you can't give yourself a point.`,
		);
	}
	else {
		// try to add the user to the DB, if they are already there
		// db function will reject this
		addUserToPoints(mentionId);
		const canAddPoint = testDates(mentionId, interaction);
		if (!canAddPoint) {
			interaction.channel.send(
				`Yo <@!${interaction.author.id}>, you have to wait **at least** a minute to give <@!${mentionId}> another point.😅`,
			);
		}
		if (canAddPoint) {
			giveUserAPoint(mentionId, interaction);
			const userPoints = countGivenPoint(mentionId, interaction.channelId);
			const emojis = ["🔥", "💯", "💃🏾", "💪🏾"];
			const randomNumber = Math.floor(Math.random() * 3);
			interaction.channel.send(
				`Woo! <@!${mentionId}> has **${userPoints} points** ${emojis[randomNumber]}`,
			);
		}
	}
}

export default givePoint;
