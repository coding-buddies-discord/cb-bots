import { insertTimezone } from "../../../db.js";

const unsubToTimezone = async (interaction) => {
	const author = interaction.author.id;
	try {
		await insertTimezone(author);
		interaction.reply("You're now Unsubscribed from the `!timezone` command");
	} catch (err) {
		console.log(err)
	}
	
};

export default unsubToTimezone;