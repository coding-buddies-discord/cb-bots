import { readFileSync } from "fs";

import { GuildMember, TextChannel } from "discord.js";

import { CBEvent } from ".";
import { config } from "../config/bot-config";
import { addUserToPoints } from "../services/points-service";
import { randomElement } from "../utils/array-utils";
import { findAndReplace } from "../utils/text-utils";

const welcomeMessage = readFileSync("./../../resources/welcome-message.txt", { encoding: "utf-8" });

const event: CBEvent<"guildMemberAdd"> = {
	name: "guildMemberAdd",
	execute(member: GuildMember) {
		const { welcomeGIFs, welcomeChannelId } = config;
		const randomGif = randomElement(welcomeGIFs);
		const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId) as TextChannel;
		const newMember = member.user.toString();

		const responseMessage = findAndReplace(welcomeMessage, { newMember });
		welcomeChannel?.send(responseMessage);
		welcomeChannel?.send(randomGif);

		addUserToPoints(member.user.id);
	},
};

export default event;
