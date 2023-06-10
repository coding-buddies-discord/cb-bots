import { User } from "discord.js";

export interface RankedUser {
	username: User["username"];
	points: number;
	user: User;
	rank: number;
}
