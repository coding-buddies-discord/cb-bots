export { commands as otherCommands } from "./other/index";
export { commands as slashCommands } from "./slash/index";
export { commands as textCommands } from "./text/index";

export interface Command {
	name: string;
	description: string;
}
