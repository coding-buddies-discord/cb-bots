import { Client, Intents } from "discord.js";
import dotenv from "dotenv";

import { events } from "./events/index";
import { populateUserCache } from "./user-cache";

const { NODE_ENV } = process.env;
const token = process.env.TOKEN;

const userCache = await populateUserCache();

dotenv.config(
	NODE_ENV === "development"
		? { path: `.env.${NODE_ENV}` }
		: {});

// Create a new client instance
export const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});

Object
	.values(events)
	.forEach(({ once, name, execute }) => {
		if(once) client.once(name, execute);
		else client.on(name, execute);
	});

// Login to Discord with your client's token
client
	.login(token);

export { };
