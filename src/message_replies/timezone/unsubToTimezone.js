import { insertTimezone } from "../../../db.js";

const unsubToTimezone = async (interaction) => {
	const author = interaction.author.id;
	await insertTimezone(author);
	interaction.reply("You're now Unsubscribed from the `!timezone` command");
};

export default unsubToTimezone;