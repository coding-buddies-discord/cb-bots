// Require the necessary discord.js classes
import { Client, Intents, Interaction } from 'discord.js';
import * as eventsObj from './events/index.js';
import dotenv from 'dotenv';
import BuddiesModel from '../models/BuddiesModel.js';

// eslint-disable-next-line no-unused-vars
const userCache = (async () => await BuddiesModel.populateUserCache())();

const { NODE_ENV } = process.env;

if (NODE_ENV === 'development') {
  dotenv.config({
    path: `.env.${NODE_ENV}`,
  });
} else {
  dotenv.config();
}

const token = process.env.TOKEN;


// Create a new client instance
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
});


interface Event {
  name: string;
  once?: boolean;
  execute(interaction: Interaction): any;
}

const events: Event[] = Object.values(eventsObj);

events.forEach((e: Event) => {
  e.once
    ? client.once(e.name, (interaction: Interaction) => e.execute(interaction)) 
      : client.on(e.name, (interaction) => e.execute(interaction));
});

// Login to Discord with your client's token
client.login(token);

export default client;
