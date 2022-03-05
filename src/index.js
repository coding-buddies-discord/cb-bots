// Require the necessary discord.js classes
import { Client, Intents } from "discord.js";
// import db from '../db.js';
import * as eventsObj from "./events/index.js";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN;
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS] });

const events = Object.values(eventsObj);
events.forEach((event) => {
	event.once ?
		client.once(event.name, (...args) => event.execute(...args)) :
		client.on(event.name, (...args) => event.execute(...args));
});

// Login to Discord with your client's token
client.login(token);
export default client;