import { MessageReaction, PartialMessageReaction, PartialUser, User } from "discord.js";

import { CBEvent } from ".";

const event: CBEvent<"messageReactionAdd"> = {
	name: "messageReactionAdd",
	execute(interaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) {
		console.log(`${interaction.message.author.username} reacted to a message`);
	},
};

export default event;
