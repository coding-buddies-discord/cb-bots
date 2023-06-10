import { TextChannel, User } from "discord.js";

export interface PointsObject {
	givenBy: User["id"];
	date: Date;
	channel: TextChannel["id"];
}
