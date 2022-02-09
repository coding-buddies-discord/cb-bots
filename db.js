import { Low, JSONFileSync } from "lowdb";

const db = new Low(new JSONFileSync("./db.json"));
db.read();
db.write();
// console.log(db);

export default () => {
	db.users.push("hello");
	return db.data;
};

