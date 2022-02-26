import { MessageEmbed } from "discord.js";

const helpCommand = (interaction, client) => {
    const embed = new MessageEmbed()
        .setTitle("Bot Buddy Commands List")
        .setColor("RANDOM")
        .setDescription(`
            \`!ping\`: View the bot response time in milliseconds.
            \`@user++\`: If a user has been helpful to you, mention their username and add ++ to give them a point.`)
    interaction.reply({ embeds: [embed] });
}

helpCommand(interaction, client);

export default helpCommand;