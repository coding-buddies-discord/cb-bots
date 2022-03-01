import { MessageEmbed } from "discord.js";

const helpCommand = (interaction, client) => {

    //Add new commands to this array.
    const commandsArray = [
        {command: `!ping`, description: `View the bot response time in milliseconds.`},
        {command: `@user++`, description: `If a user has been helpful to you, mention their username and add ++ to give them a point.`},
        {command: `!points`, description: `View the top 5 users who have attained the most points in the current channel.`}
    ]

   function outputCommands() {
        const newArray = []
        for (let i = 0; i < commandsArray.length; i++) {
            newArray.push(`\`${commandsArray[i].command}\`: ${commandsArray[i].description.concat(`\n`)}`);
        }
        return newArray.join(" ");
   }

    const embed = new MessageEmbed()
        .setTitle("Bot Buddy Commands List")
        .setColor("RANDOM")
        .setDescription(`${outputCommands()}`)
    interaction.reply({ embeds: [embed] });
}

export default helpCommand;