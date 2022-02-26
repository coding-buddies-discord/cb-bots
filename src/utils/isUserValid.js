export const isUserValid = async (interaction, userId) => {
	try {
		// eslint-disable-next-line no-unused-vars
		const user = await interaction.guild.members.fetch(userId);
		return true;
	}
	catch (err) {
		console.log(err);
		return false;
	}
};