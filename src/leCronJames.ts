import { Client, TextChannel } from "discord.js";
import cron from "node-cron";

export const leCronJames = (client: Client) => {
	const channel = client.channels.cache.get(process.env.GENERAL_CHANNEL!) as TextChannel;

	const endOfWeekShout = cron
		.schedule(
			"0 30 8 * * FRI",
			() => channel.send("@here Happy Friday Coding Buddies! Drop your weekly wins below, doesn't matter how big or small, code or not! 🎉👇 Let's hear it..."),
			{ timezone: "America/New_York", }
		);

	endOfWeekShout.start();
};
