import { User } from "discord.js";

export interface PointGivenBy {
	userId: User["id"];
	date: Date;
}
