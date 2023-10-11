import { MongoDBConnection } from "@/services/databases/mongodb/connection.database";
import { KindI } from "@/services/databases/mongodb/dtos/kind.dto";
import { Model } from "mongoose";

export class KindRepository {
	private readonly model: Model<KindI>;
	constructor(dbConnection: MongoDBConnection) {
		this.model = dbConnection.get("kind") as Model<KindI>;
	}
}
