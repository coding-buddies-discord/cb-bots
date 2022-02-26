const invalidPoint = (interaction, mentionId) => {
	interaction.channel.send(`Sorry <@!${interaction.author.id}>, You need to wait at least 1min to give another point to <@!${mentionId}>.`);
};

export default invalidPoint;