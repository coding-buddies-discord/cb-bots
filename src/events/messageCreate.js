export default {
	name: "messageCreate",
	execute(interaction) {
		console.log(`${interaction.author.username} sent a message`);
	},
};