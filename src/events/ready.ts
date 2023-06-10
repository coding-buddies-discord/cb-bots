import { Client } from "discord.js";

import { CBEvent } from ".";
import { leCronJames } from "../leCronJames";

const event: CBEvent<"ready"> = {
	name: "ready",
	once: true,
	execute(client: Client) {
		if(!client.user) return;

		const { username, discriminator } = client.user;
		console.log(`Ready as ${username}#${discriminator}!`);

		client
			.user
			.setPresence({
				status: "online",
				activities: [{ name: "The buddies bot 🤖", type: "PLAYING" }],
			});

		leCronJames(client);
	},
};

export default event;
