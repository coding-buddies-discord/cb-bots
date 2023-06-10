import { TextChannel } from "discord.js";
import { config } from "../config/bot-config";
import { randomElement } from "./array-utils";

// list of users to create points for
type Id = string;

const devUsers: Id[] = config.devUsersId;
const devChannels: Id[] = config.devChannelsId;

interface Interaction {
	author: { id: string; };
	channelId: TextChannel["id"];
};

// creates args for fake points
export const createMockPoint = (): [string, Interaction] => {
	const users: Id[] = [...devUsers];
	const userId = randomElement(users);
	users.splice(users.indexOf(userId), 1);
	const interaction = {
		author: {
			id: randomElement(users),
		},
		channelId: randomElement(devChannels),
	};

	return [userId, interaction];
};
