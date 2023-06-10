import { ObjectId } from "mongodb";

export interface UserPoints {
	_id: ObjectId;
	points: number;
	rank: number;
};
