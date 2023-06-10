import { readFileSync } from "fs";

import { encode } from "html-entities";
import { textCommands } from "../commands";
import { RankedUser } from "../models/RankedUser";
import { findAndReplace } from "../utils/text-utils";

export const helpStyle = readFileSync("./../../resources/help-style.css", { encoding: "utf-8" });
export const pointsStyle = readFileSync("./../../resources/points-style.css", { encoding: "utf-8" });

const bodyTemplate = readFileSync("./../../resources/body.html", { encoding: "utf-8" });
const helpCommandsTemplate = readFileSync("./../../resources/help-commands.html", { encoding: "utf-8" });
const userListTemplate = readFileSync("./../../resources/user-list.html", { encoding: "utf-8" });
const leaderBoardTemplate = readFileSync("./../../resources/leader-board.html", { encoding: "utf-8" });

export const getBodyHTML = (body: string, styles: string) =>
	findAndReplace(bodyTemplate, { body, styles });

export const getHelpHTML = (): string =>
	findAndReplace(helpCommandsTemplate, { commands: getCommandListHTML() });

const getCommandListHTML = (): string =>
	"<ul>" +
	textCommands
		.map(({ name, description }) => `<li><b>${name}:</b> ${description} </li>`)
		.join("\n") +
	"</ul>";

const getUserPointsListHTML = (caller: string, arr: RankedUser[]): string => arr
	.map((user) => {
		const { username, points, rank } = user;
		const { id, avatar } = user.user;
		const defaultPic = "https://cdn.discordapp.com/embed/avatars/0.png";
		const imgSrc = avatar
			? `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp`
			: defaultPic;
		const isCaller = caller === username ? "pointUser" : "";
		return findAndReplace(userListTemplate, { isCaller, imgSrc, rank, username: encode(username), points });
	})
	.join("\n");

export const getLeaderBoardHTML = (channelName: string, caller: string, usersArr: RankedUser[], listOfUsers = getUserPointsListHTML): string =>
	findAndReplace(leaderBoardTemplate, { channelName: encode(channelName) }) +
	"\n" +
	listOfUsers(caller, usersArr);
