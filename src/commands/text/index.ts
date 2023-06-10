import { Command } from "../index";
import { command as goodbot } from "./goodbot";
import { command as js } from "./js";
import { command as ping } from "./ping";
import { command as points } from "./points";

export interface TextCommand extends Command {
	execute: () => void;
}

export const commands: TextCommand[] = [
	goodbot,
	js,
	ping,
	points,
];
