import { User } from "discord.js";

export interface ValidatedUser {
	username: User["username"];
	validUser: boolean;
	user?: User;
}
