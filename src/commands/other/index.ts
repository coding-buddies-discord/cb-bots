import { Command } from "../index";
import { command as userPP } from "./user++";

export interface OtherCommand extends Command {
}

export const commands: OtherCommand[] = [
	userPP,
];
