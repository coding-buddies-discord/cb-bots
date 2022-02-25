export const isUserValid = async (interaction, userId) => {
	try {
		const user = await interaction.guild.members.fetch(userId);
		return true
	}
	catch(err) {
		console.log(err)
		return false
	}
	
	 
}