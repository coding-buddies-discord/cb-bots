import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const clientId = process.env.CLIENTID;
const token = process.env.TOKEN;
const guildId = process.env.GUILDID;

const commands = [
  new SlashCommandBuilder().setName('when').setDescription('Who'),
  new SlashCommandBuilder().setName('new').setDescription('testing-db'),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
