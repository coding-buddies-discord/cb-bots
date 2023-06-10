import { Message } from "discord.js";
import { connectDb } from "../src/database";
import { createMockPoint } from "../src/utils/seed-utils";

import dotenv from "dotenv";
import { giveUserAPoint } from "../src/services/points-service";

dotenv.config();

await connectDb()
	.then(({ collection }) => collection.deleteMany({})) // let's clear he db first
	.then(_ => Array
		.from({ length: 100 }, _ => createMockPoint()) // loop through and create 100 points in the server
		.map(([userId, interaction]) => giveUserAPoint(userId, interaction as Message)))
	.then(Promise.all) // wait for all the promises to resolve
	.then(_ => console.log("Data was seeded to the points collection, happy developing 🥳"))
	.catch(console.error);

export { };
