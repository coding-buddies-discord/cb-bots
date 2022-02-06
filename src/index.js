/* eslint-disable quotes */
// Require the necessary discord.js classes
import { Client, Intents } from 'discord.js';
import config from '../config.js';

const { token } = config;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'what') {
		// console.log('its getting there');
		await interaction.reply('Who');
	}
});

// Login to Discord with your client's token
client.login(token);

