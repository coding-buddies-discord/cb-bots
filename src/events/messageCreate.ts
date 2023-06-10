import { Message } from "discord.js";

import { config } from "../config/bot-config";
import client from "../index";
import { formatCode } from "../services/format-code-service";
import { givePoint } from "../services/give-point";
import { helpCommand } from "../services/help-command";
import { addUserToPoints } from "../services/points-service";
import { reportChannelPoints, reportGlobalPoints } from "../services/report-channel-points";
import { sendPing } from "../services/send-ping";
import { CBEvent } from "./index";

function matchSuffix(str: string): string[] {
	const myExp = /<@!?\d+> ?\+{2}/g;
	// it will always return an array, in case there's no match, the array will be empty
	const matches = [...str.matchAll(myExp)];
	// matches return an array with various details, from which we only need those in index 0;
	return matches.map((match) => match[0]);
}

const event: CBEvent<"messageCreate"> = {
	name: "messageCreate",
	async execute(message: Message) {
		// Avoid an iteration
		if(message.author.bot) return;

		// try to add the user to the points DB, if they are already there
		// db function will reject this
		await addUserToPoints(message.author.id);

		// Prefix and message content
		const { content } = message;

		// finds prefix at the beginning
		const findPrefix = content.match(/^!\w+/);
		// if there's a match, tries to grab the first value of the array or undefined;
		const prefixCommand = findPrefix?.[0];
		const findSuffix = matchSuffix(content);

		if(!findSuffix.length && !prefixCommand) return;

		// TODO: let's refacotr this to a lookup table once !points becomes one function
		if(!prefixCommand) return givePoint(findSuffix, message);

		if(prefixCommand === "!ping") return sendPing(message, client);
		if(prefixCommand === "!pong") return message.channel.send("ping");
		if(prefixCommand === "!points") {
			if(/-[gG]$/.test(content)) return await reportGlobalPoints(message);
			return await reportChannelPoints(message);
		}
		if(prefixCommand === "!help") return helpCommand(message);
		if(prefixCommand === "!goodbot") return message.reply("☺️");
		if(config.languagesFormats.includes(prefixCommand)) return await formatCode(message.content, prefixCommand)
			.then(response => message.reply(response));
		return;

		givePoint(findSuffix, message);
	},
};

export default event;
