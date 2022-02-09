// Require the necessary discord.js classes
import { Client, Intents } from "discord.js";
import config from "../config.js";
// import db from '../db.js';
import * as eventsObj from "./events/index.js";

const { token } = config;
// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const events = Object.values(eventsObj);
events.forEach((event) => {
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));

	}
});

// Login to Discord with your client's token
client.login(token);

