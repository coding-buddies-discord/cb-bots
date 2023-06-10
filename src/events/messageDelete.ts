import { Message, PartialMessage } from "discord.js";

import { CBEvent } from ".";

const event: CBEvent<"messageDelete"> = {
	name: "messageDelete",
	execute(interaction: Message | PartialMessage) {
		console.log(interaction);
		console.log(`${interaction.author.username} deleted a message`);
	},
};

export default event;
