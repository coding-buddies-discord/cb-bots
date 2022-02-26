/* eslint-disable no-case-declarations */
import config from "../../config.js";
import client from "../index.js";
import * as messageReplies from "../message_replies/index.js";
import { getUserIdFromMention } from "../utils/getUserIdFromMention.js";
import { MessageEmbed } from "discord.js";


export default {
	name: "messageCreate",
	execute(interaction) {
		// Avoid an iteration
		if (interaction.author.bot) return;
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
					messageReplies.sendPing(interaction, client);
					break;
				case "!pong":
					interaction.channel.send("ping");
					break;
				case "!help":
					const helpCommand = (interaction, client) => {
						const embed = new MessageEmbed()
							.setColor("RANDOM")
							.setDescription("blah blah blah")
						interaction.channel.send({ embeds: [embed] });
					}
					helpCommand(interaction, client);
					break;
				default:
					interaction.channel.send(`I didnt recognize the request "${command}"`);
				}
			}
			if (command.at(1) === "@" && command.includes(suffix)) {
				const mentionId = getUserIdFromMention(command);
				if (interaction.author.id === mentionId) {
					return interaction.channel.send("You cannot give a point to yourself");
				}
				interaction.channel.send("Added a point!");
			}
		});

	},
};