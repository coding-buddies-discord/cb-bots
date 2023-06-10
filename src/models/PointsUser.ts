import { ObjectId } from "mongodb";

import { PointGivenBy } from "./PointGivenBy";
import { PointsObject } from "./PointsObject";

export interface PointsUser {
	_id: ObjectId;
	pointsReceived: PointsObject[];
	pointsGiven: unknown[];
	lastPointsGivenBy: PointGivenBy[];
}
