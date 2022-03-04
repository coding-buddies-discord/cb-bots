const invalidPoint = (interaction, mentionId) => {
	interaction.channel.send(`Yo <@!${interaction.author.id}>, you have to wait at least a minute to give <@!${mentionId}> another point.😅`);
};

export default invalidPoint;