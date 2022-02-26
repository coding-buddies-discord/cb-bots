export const isUserValid = async (interaction, userId) => {
	try {
		// eslint-disable-next-line no-unused-vars
		const user = await interaction.guild.members.fetch(userId);
		return { username: user.user.username, validUser: true };
	}
	catch (err) {
		return {username: "Unknown", validUser: false };
	}
};