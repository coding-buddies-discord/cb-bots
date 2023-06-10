import { Command } from "../index";
import { command as newC } from "./new";
import { command as when } from "./when";

export interface SlashCommand extends Command {
}

export const commands: SlashCommand[] = [
	newC,
	when,
];
