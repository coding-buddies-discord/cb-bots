import { Message } from 'discord.js';

export default {
  name: 'messageDelete',
  execute(interaction: Message) {
    console.log(interaction);
    console.log(`${interaction.author.username} deleted a message`);
  },
};
