import { ClientEvents } from "discord.js";

import { default as guildMemberAdd } from "./guildMemberAdd";
import { default as messageCreate } from "./messageCreate";
import { default as messageDelete } from "./messageDelete";
import { default as messageReactionAdd } from "./messageReactionAdd";
import { default as ready } from "./ready";

export interface CBEvent<T extends keyof ClientEvents> {
	name: T;
	once?: boolean;
	execute: (...args: ClientEvents[T]) => void;
}

export const events = [
	guildMemberAdd,
	messageCreate,
	messageDelete,
	messageReactionAdd,
	ready,
];
