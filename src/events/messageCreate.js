// import config from "../../config.js";
import client from "../index.js";
import {
	sendPing,
	reportChannelPoints,
	givePoint,
	helpCommand,
	sendBotIntro,
} from "../message_replies/index.js";
import { addUserToPoints } from "../../db.js";
import { addUserToCache } from '../utils/userCache.js';


async function matchSufix(str) {
	const myExp = /<@!?\d+> ?\+{2}/g;
	// it will always return an array, in case there's no match, the array will be empty
	const matches = [...str.matchAll(myExp)];
	// matches return an array with various details, from which we only need those in index 0;
	return matches.map(match => match[0]);
}

export default {
	name: "messageCreate",
	execute(interaction) {
		// Avoid an iteration
		if (interaction.author.bot) return;

		// try to add the user to the points DB, if they are already there
		// db function will reject this
		const isNewUser = await addUserToPoints(interaction.author.id);

		// NOTE: THIS IS COMPLETE
		// if (isNewUser) {
		// 	sendBotIntro(interaction);
		// }

		// Prefix and message content
		// const { suffix } = config;
		const { content } = interaction;

		// finds prefix at the beggining
		const findPrefix = content.match(/^!\w+/);
		// if there's a match, tries to grab the first value of the array or undefined;
		const prefixCommand = findPrefix?.[0];
		const findSufix = matchSufix(content);


		if (!findSufix.length && !prefixCommand) {
			return;
		}

		console.log(prefixCommand)

		if (prefixCommand) {
			switch (prefixCommand.toLowerCase()) {
				case "!ping":
					sendPing(interaction, client);
					break;
				case "!pong":
					interaction.channel.send("ping");
					break;
				case "!points":
					reportChannelPoints(interaction);
					break;
				case "!help":
					helpCommand(interaction, client);
					break;
				case "!goodbot":
					interaction.reply("☺️");
					break;
				default:
					return;
			}
		}

		if (findSufix.length) {
			findSufix.forEach((command) => {
				givePoint(command, interaction);
			});
		}
	},
};