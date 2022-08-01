export default {
  name: 'messageDelete',
  execute(interaction) {
    console.log(`${interaction.author.username} deleted a message`);
  },
};
