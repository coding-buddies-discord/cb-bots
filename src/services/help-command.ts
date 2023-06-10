import { Message } from "discord.js";

import { getBodyHTML, getHelpHTML, helpStyle } from "./html-service";
import { imgFromHtmlGenerator } from "./image-generation-service";

export const helpCommand = (message: Message) => Promise
	.resolve()
	.then(getHelpHTML)
	.then(staticHTML => getBodyHTML(staticHTML, helpStyle))
	.then(body => imgFromHtmlGenerator(body))
	.then(image => message.reply({ files: [{ attachment: image }] }))
	.catch(error => {
		console.log(error);
		message.reply("Unable to send help at this time. ¯\\_(ツ)_/¯");
	});
