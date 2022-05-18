import config from "../../config.js";
import client from "../index.js";
import {
	sendPing,
	reportChannelPoints,
	givePoint,
	helpCommand,
} from "../message_replies/index.js";
import { addUserToPoints } from "../../db.js";

export default {
	name: "messageCreate",
	execute(interaction) {
		// Avoid an iteration
		if (interaction.author.bot) return;

		// try to add the user to the points DB, if they are already there
		// db function will reject this
		addUserToPoints(interaction.author.id);

		// Prefix and message content
		const { suffix } = config;
		const { content } = interaction;

		// finds prefix at the beggining
		const findPrefix = content.match(/^!\w+/);
		// if there's a match, tries to grab the first value of the array or undefined;
		const prefixCommand = findPrefix?.[0];

		const commands = content.split(" ").filter((word) => {
			if (word.length <= 5) {
				return false;
			} else if (word.indexOf(suffix) === word.length - 2) {
				return true;
			} else {
				return false;
			}
		});

		if (!commands.length && !prefixCommand) {
			return;
		}

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
				default:
					return;
			}
		}

		if (commands.length) {
			commands.forEach((command) => {
				givePoint(command, interaction);
			});
		}
	},
};