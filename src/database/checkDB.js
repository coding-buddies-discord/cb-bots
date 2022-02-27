import { LowSync, JSONFileSync } from "lowdb";
import fs from "fs";

const createDbProps = (db) => {
	const props = ["points", "example", "example2"];
	for (const prop of props) {
		const isInDB = prop in db.data;
		if (!isInDB) {
			db.data[prop] = {};
		}
	}
	console.log("added necessary props to db.json")
};

const openDB = () => {
	const db = new LowSync(new JSONFileSync("db.json"));
	db.read();
	return db;
};

export const checkDB = () => {
	console.log("checking...");
	const path = "db.json";
	try {
		const dbExists = fs.existsSync(path);
		if (!dbExists) {
			fs.appendFileSync("db.json", "{}");
			console.log("db.json created")
		}
		if (fs.readFileSync(path).length === 0) {
			fs.appendFileSync("db.json", "{}");
			console.log("db.json was empty, added an empty object")
		}
		const db = openDB();
		createDbProps(db);
		db.write();
	} catch (err) {
		console.error(err);
	}
};
