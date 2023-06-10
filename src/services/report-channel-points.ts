import { Message, TextChannel } from "discord.js";

import { leaderBoardBody, styles } from "../image-templates/points";
import { BuddiesModel } from "../models/BuddiesModel";
import { RankedUser } from "../models/RankedUser";
import { isUserValid } from "../utils/user-utils";
import { getBodyHTML } from "./html-service";
import { imgFromHtmlGenerator, } from "./image-generation-service";
import { channelPoints, getUserGlobalPoints, globalPoints } from "./points-service";

export const reportChannelPoints = async (message: Message) => {
	const { channelId, author } = message;
	const { id: callerId } = author;
	const topPointEarners = await channelPoints(channelId, 8);

	const arrOfValidUsers: RankedUser[] = [];
	for(const { _id, points, rank } of topPointEarners) {
		const { username, validUser, user } = await isUserValid(message, _id);
		if(validUser) arrOfValidUsers.push({ username, points, user, rank });
	}

	if(arrOfValidUsers.length === 0)
		return message.reply("There are no points in this channel yet, you should give someone one.😏");

	// if the caller is not in the top 8, go get their point data and append it to the end of the list
	if(!arrOfValidUsers.filter(({ user }) => user.id === callerId).length) {
		const { points, rank } = await BuddiesModel
			.getUserInfoOfChannel(callerId, channelId)
			.catch(console.log);
		const { username, validUser, user } = await isUserValid(message, callerId);

		validUser
			? arrOfValidUsers.push({ username, points, rank, user, })
			: null;
	}

	const caller = message.author.username;
	const channelName = (message.channel as TextChannel).name;
	const userListHTML = leaderBoardBody(channelName, caller, arrOfValidUsers);
	const body = getBodyHTML(userListHTML, styles);

	try {
		const img = await imgFromHtmlGenerator(body);
		if(!(img instanceof Error)) message.reply({ files: [{ attachment: img }] });
	} catch(err) {
		console.log(err);
		message.reply("Oof, sorry. I couldn't figure out who the leader is. Try again.");
	}
};

export const reportGlobalPoints = async (message: Message) => {
	const { author } = message;
	const { id: callerId } = author;
	const topPointEarners = await globalPoints(8);

	if(topPointEarners.length === 0) return message.reply("There are no points in this server yet, you should give someone one.😏");

	const arrOfValidUsers: RankedUser[] = [];
	for(const { _id, points, rank } of topPointEarners) {
		if(points === 0) continue;
		const { username, validUser, user } = await isUserValid(message, _id);
		if(validUser) {
			arrOfValidUsers.push({ username, points, user, rank });
		}
	}

	// if the caller is not in the top 8, go get their point data and append it to the end of the list
	if(!arrOfValidUsers.filter(({ user }) => user.id === callerId).length) {
		const { points, rank } = await getUserGlobalPoints(callerId)
			.catch((err) => console.log(err));

		const { username, validUser, user } = await isUserValid(message, callerId);

		if(validUser) arrOfValidUsers.push({ username, points, rank, user, });
	}

	const caller = message.author.username;
	const channelName = "Global Score";
	const userListHTML = leaderBoardBody(channelName, caller, arrOfValidUsers);
	const body = getBodyHTML(userListHTML, styles);

	await imgFromHtmlGenerator(body, message)
		.then((img) => message.reply({ files: [{ attachment: img }] }))
		.catch((err) => {
			console.log(err);
			return message.reply("Oof, sorry. I couldn't figure out who the leader is. Try again.");
		});
};
