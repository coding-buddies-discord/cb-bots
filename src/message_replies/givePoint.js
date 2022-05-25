import { getUserIdFromMention } from "../utils/getUserIdFromMention.js";
import { isUserValid } from "../utils/isUserValid.js";
import {
	addUserToPoints,
	giveUserAPoint,
	countGivenPoint,
	testDates,
} from "../../db.js";

async function givePoint(command, interaction) {
	const mentionId = getUserIdFromMention(command);

	if (!mentionId) return interaction.reply(`Sorry <@!${interaction.author.id}>, can't find ${command}.\n(╯°□°）╯︵ ┻━┻`);

	const { validUser, username } = await isUserValid(interaction, mentionId);


	// TODO: this donesn't wonk
	if (!validUser) {
		interaction.reply(
			// eslint-disable-next-line no-useless-escape
			`Sorry <@!${interaction.author.id}>, idk who ${command} is. ¯\\_(ツ)_/¯`,
		);
	}
	else if (interaction.author.id === mentionId) {
		interaction.reply(
			`Lmao <@!${interaction.author.id}>, you can't give yourself a point.`,
		);
	}
	else {
		// try to add the user to the DB, if they are already there
		// db function will reject this
		addUserToPoints(mentionId);
		const canAddPoint = await testDates(mentionId, interaction);
		if (!canAddPoint) {
			interaction.reply(
				`Yo **${interaction.author.username}**, you have to wait **at least** a minute to give **${username}** another point.😅`,
			);
		}
		if (canAddPoint) {
			await giveUserAPoint(mentionId, interaction);
			const { score, scoreTotal } = await countGivenPoint(mentionId, interaction.channelId);

			const emojis = ["🔥", "💯", "💃🏾", "💪🏾"];
			const randomNumber = Math.floor(Math.random() * 3);
			interaction.reply(

				`Woo! **${username}** has **${score} points** in <#${interaction.channelId}> and **${scoreTotal}** points in total. ${emojis[randomNumber]}`,

			);
		}
	}
}

export default givePoint;
