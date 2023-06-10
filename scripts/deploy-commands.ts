import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { slashCommands } from "../src/commands";

import dotenv from "dotenv";

dotenv.config();

const clientId = process.env.CLIENTID!;
const token = process.env.TOKEN!;
const guildId = process.env.GUILD_ID!;

const commands = slashCommands
	.map(({ name, description }) => new SlashCommandBuilder()
		.setName(name)
		.setDescription(description)
		.toJSON());

await Promise
	.resolve(new REST({ version: "9" }))
	.then(rest => rest.setToken(token))
	.then(rest => rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands }))
	.then(() => console.log("Successfully registered application commands."))
	.catch(console.error);

export { };
