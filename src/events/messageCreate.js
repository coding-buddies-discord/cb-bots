import config from "../../config.js";
import { MessageEmbed } from "discord.js";
import client from "../index.js";

export default {
	name: "messageCreate",
	execute(interaction) {
		// Avoid an iteration
		if (interaction.author.bot) return;
		// Prefix and message content
		const { prefix } = config;
		const { content } = interaction;
		// Dividing the message
		const args = content.indexOf(prefix) === 0 ?
			content.slice(prefix.length).trim().split(/ +/g) : undefined;
		// If there's no command just return
		if (!args) return;
		const cmd = args[0];

		if (cmd === "ping") {
			// eslint-disable-next-line prefer-const
			let ping = client.ws.ping;
			const embed = new MessageEmbed()
				.setColor("RANDOM")
				.setAuthor({
					name: interaction.author.tag,
					iconURL: interaction.author.avatarURL(),
				})
				.setDescription(ping + "ms From Bot API")
				.setTimestamp()
				.setFooter({
					text: "Pong!",
					iconURL: client.user.avatarURL(),
				});
			interaction.channel.send({ embeds: [embed] });
		}
	},
};