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

	if (!mentionId) return;
	const { validUser } = await isUserValid(interaction, mentionId);
	if (!validUser) {
		interaction.channel.send(
			`Sorry <@!${interaction.author.id}>, It appears that ${command} is an **invalid user** or **isn't currently in the server**`,
		);
	}
	else if (interaction.author.id === mentionId) {
		interaction.channel.send(
			`Sorry <@!${interaction.author.id}>, You cannot give a point to yourself.`,
		);
	}
	else {
		// try to add the user to the DB, if they are already there
		// db function will reject this
		addUserToPoints(mentionId);
		const canAddPoint = testDates(mentionId, interaction);
		if (!canAddPoint) {
			interaction.channel.send(
				`Sorry <@!${interaction.author.id}>, You need to wait at least 1min to give point to <@!${mentionId}> again`,
			);
		}
		if (canAddPoint) {
			giveUserAPoint(mentionId, interaction);
			const userPoints = countGivenPoint(mentionId, interaction.channel.name);
			interaction.channel.send(
				`Point added! Now <@!${mentionId}> has **${userPoints} points**`,
			);
		}
	}
}

export default givePoint;
