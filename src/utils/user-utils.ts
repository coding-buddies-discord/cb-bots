import { Message } from "discord.js";
import { MaybeUser } from "../models/MaybeUser";
import { ValidatedUser } from "../models/ValidatedUser";

export const isUserValid = (message: Message, userId: string): Promise<ValidatedUser> =>
	message
		.guild
		.members
		.fetch(userId)
		.then(({ user }) => ({ username: user.username, validUser: true, user }))
		.catch((_) => ({ username: "Unknown", validUser: false }));

export const getUserIdFromMention = (ID: string): MaybeUser => {
	const userId = ID.match(/(?!0)+(\d)+/g);
	const id = userId?.[0];

	if(!id || id.length < 8) {
		const falseID = ID.match(/\d+/g)?.[0] || 0;
		return { isPossibleID: false, id: falseID.toString() };
	}

	return { id, isPossibleID: true };
};
