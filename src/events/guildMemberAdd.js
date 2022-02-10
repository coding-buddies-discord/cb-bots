// import { MessageEmbed } from "discord.js";

export default {
	name: "guildMemberAdd",
	execute(client) {
		const welcomeChannel = client.guild.channels.cache.get("941167349854248961");
		welcomeChannel.send("welcome to the server");

	},
};