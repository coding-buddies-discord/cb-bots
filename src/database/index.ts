import dotenv from "dotenv";
import { Document, MongoClient } from "mongodb";

dotenv.config();

export const connectDb = <T extends Document>() => Promise
	.resolve(new MongoClient(process.env.MONGO_URI!))
	.then(client => client.connect())
	.then(client => {
		const db = client.db(process.env.DB_NAME);
		const collection = db.collection<T>(process.env.ACTIVE_ENV! === "test" ? "test" : process.env.COLLECTION_NAME!);
		return { db, collection };
	})
	.catch(error => {
		console.log(error);
		throw new Error("Failed to connect to DB");
	});
