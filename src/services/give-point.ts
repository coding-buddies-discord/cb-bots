import { Message } from "discord.js";

import { MaybeUser, getUserIdFromMention, isUserValid } from "../utils/user-utils";
import { testDates } from "./dates-service";
import { giveUserAPoint } from "./points-service";

const ARRAY_OF_POINTS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

type DiscordVerified = MaybeUser & { name: string; };

export async function givePoint(commandArr: string[], message: Message) {
	const caller = message.author.id;

	// check if ids are valid or not and returns an array of objects
	// the objects have shape {isPossible: boolean, ID: string}
	let mentionIDs = commandArr.map((command) => getUserIdFromMention(command));

	// filter those that are repeated
	mentionIDs = mentionIDs
		.reduce((acc, IDObj) => {
			// removes those who's id is alread in the array and grab the array length
			const filteredLength = acc.filter(({ id }) => id !== IDObj.id).length;

			if(acc.length === filteredLength) {
				acc.push(IDObj);
				return acc;
			}
			return acc;
		}, []);

	if(mentionIDs.length > 9) {
		mentionIDs = mentionIDs.slice(0, 9);
		await message.reply(`Sorry <@!${caller}>, You can only give points to 9 people per message.\nPoints will be given ONLY for the first 9 people mentioned`);
	}

	// maintain only those that are valid
	const validIDs = mentionIDs.filter((mentionID) => mentionID.isPossibleID);

	// checks ID's against discord and keeps only those that are valid in the discord API

	let discordVerified: DiscordVerified[] = [];
	for(const idObj of validIDs) {
		const { validUser, username: name } = await isUserValid(message, idObj.id);
		if(validUser) discordVerified.push({ ...idObj, name });
	}

	// finding if is someone has the same id than the caller.
	const hasCallerMention = discordVerified.some(({ id }) => caller === id);

	if(hasCallerMention) {
		// filters the caller out
		discordVerified = discordVerified.filter(({ id }) => id !== caller);
		message.reply(`Lmao <@!${caller}>, you can't give yourself a point.`);
	}

	// keeps track the total points given and those who weren't
	let givenPoints = 0;
	const notGivenPoints: string[] = [];

	//  check agaist the DB if the date is valid (if last points was more than 1min ago)
	for(const { id, name } of discordVerified) {
		const canAddPoint = await testDates(id, message.author.id);
		if(!canAddPoint) {
			notGivenPoints.push(name);
			continue;
		}
		await giveUserAPoint(id, message);
		givenPoints++;
	}

	if(notGivenPoints.length) {
		const str = notGivenPoints.reduce((curr, acc) => `${curr}${acc}, `, "");
		message.reply(`Yo **${message.author.username}**, you have to wait **at least** a minute to give **${str}** another point.😅`);
	}
	if(!givenPoints) return;
	try {
		const stonks = message.guild.emojis.cache.find(emoji => emoji.name === "stonks");
		await message.react("🤖");
		await message.react(stonks || "🔥");
		await message.react(ARRAY_OF_POINTS[givenPoints - 1]);
	} catch(err) {
		console.error(err);
	}
}
