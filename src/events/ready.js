export default {
	name: "ready",
	once: true,
	execute(client) {
		const { username, discriminator } = client.user;
		console.log(`Ready as ${username}#${discriminator}!`);

		client.user.setPresence({
			status: "idle",
			activities: [{ name: "Being developed by the buddies 🔥", type: "PLAYING" }],
		});
	},
};