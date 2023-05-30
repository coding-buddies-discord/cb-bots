import { MessageReaction } from 'discord.js';

export default {
  name: 'messageReactionAdd',
  execute(interaction: MessageReaction) {
    console.log(`${interaction.message.author.username} reacted to a message`);
  },
};
