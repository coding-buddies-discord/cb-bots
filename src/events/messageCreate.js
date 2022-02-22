/* eslint-disable no-case-declarations */
import config from "../../config.js";
import client from "../index.js";
import * as messageReplies from "../message_replies/index.js";


export default {
	name: "messageCreate",
	execute(interaction) {
		// Avoid an iteration
		if (interaction.author.bot) return;
		// Prefix and message content
		const { prefix, suffix } = config;
		const { content } = interaction;

		const commands = [];

		// splits the message up by each space and determines if the word has a prefix or suffix
		// it also checks if the lenght is 1 or if it has a prefex and suffix
		content.split(" ").forEach((word) => {
			if (word.length === 1) {return;}
			if (word.indexOf(prefix) === 0 && word.indexOf(suffix) === word.length - 2) {return;}
			if (word.indexOf(prefix) === 0 || word.indexOf(suffix) === word.length - 2) {commands.push(word);}
			else {return;}
		});

		if (!commands.length) {
			return;
		}

		commands.forEach((command) => {
			// if the prefix is at beginning of the word, then go through all the possible prefix commands
			if (command.at(0) === prefix) {
				switch (command) {
				case "!ping":
					messageReplies.sendPing(interaction, client);
					break;
				case "!pong":
					interaction.channel.send("ping");
					break;
				default:
					interaction.channel.send(`I didnt recognize the request "${command}"`);
				}
			}
			if (command.at(1) === "@" && command.includes(suffix)) {
				interaction.channel.send("Added a point!");
			}
		});

		// LEAVING ALL OF THIS DOWN HERE INCASE WE WANT TO COME BACK TO IT

		// Figuring out if the message had the prefix or the suffix
		// 	const hadPrefix = content.indexOf(prefix) === 0 && content.substring(1);
		// 	const hadSuffix = content.indexOf(suffix) === content.length - 2 && content.substring(0, content.length - 2);

		// 	// If there's no command just return
		// 	if (!hadPrefix && !hadSuffix) return;

		// 	const cmd = hadPrefix || hadSuffix;

	// 	if (hadPrefix) {
	// 		switch (cmd) {
	// 		case "ping":
	// 			// here is the reply that chris wrote, just abstracted
	// 			// out to it's own module and called here
	// 			messageReplies.sendPing(interaction, client);
	// 			break;
	// 		case "pong":
	// 			interaction.channel.send("ping");
	// 			break;
	// 		default:
	// 			interaction.channel.send("I didnt recognize that message request");
	// 		}
	// 	}
	// 	// if hadPrefix is false then it had to have had the suffix
	// 	// here is where we can call the functions that will give points
	// 	else {interaction.channel.send("This is where the magic will happen to give people points");}
	// },
	},
};