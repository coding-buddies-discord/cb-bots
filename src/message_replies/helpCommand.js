import { MessageEmbed } from "discord.js";
import commandsList from "../../models/commandsList.js";

const helpCommand = (interaction, client) => {
	function outputCommands() {
		const newArray = [];
		for (let i = 0; i < commandsList.length; i++) {
			newArray.push(`\`${commandsList[i].command}\`: ${commandsList[i].description}\n`);
		}
		newArray.sort();
		return newArray.join("");
	}

	const embed = new MessageEmbed()
		.setTitle("Bot Buddy Commands List")
		.setColor("RANDOM")
		.setDescription(`${outputCommands()}`);
	interaction.reply({ embeds: [embed] });
};

export default helpCommand;