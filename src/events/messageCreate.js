/* eslint-disable no-case-declarations */
import config from "../../config.js";
import client from "../index.js";
import { sendPing, reportChannelPoints, givePoint, helpCommand } from "../message_replies/index.js";
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
		const { prefix, suffix } = config;
		const { content } = interaction;

		// goes through each word in the message to see if it should or shouldnt be a command
		const commands = content.split(" ").filter((word) => {
			if (word.length === 1) {return false;}
			// this is to protect from someone sending a word with a prefix and suffix
			if (word.indexOf(prefix) === 0 && word.indexOf(suffix) === word.length - 2) { return false; }
			if (word.indexOf(prefix) === 0 || word.indexOf(suffix) === word.length - 2) { return true; }
			else {return false;}
		});

		if (!commands.length) {
			return;
		}

		commands.forEach((command) => {
			// if the prefix is at beginning of the word, then go through all the possible prefix commands
			if (command.at(0) === prefix) {
				switch (command.toLowerCase()) {
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
					//interaction.channel.send(`I didnt recognize the request "${command}"`);
					return
				}
			}
			if (command.at(1) === "@" && command.includes(suffix)) {
				givePoint(command, interaction);
			}
		});

	},
};

