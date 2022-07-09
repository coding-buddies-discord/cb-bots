export const isUserValid = async (interaction, userId) => {
	try {
		// eslint-disable-next-line no-unused-vars
		const user = await interaction.guild.members.fetch(userId);
		const newUser = user.user
		return { username: newUser.username, validUser: true, user: newUser };
	}
	catch (err) {
		return { username: "Unknown", validUser: false };
	}
};