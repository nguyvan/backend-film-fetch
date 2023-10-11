import { DatabaseError } from "@/errors/database.error";
import { MongoDBConnection } from "./mongodb/connection.database";
import { NeDBConnection } from "./nedb/connection.database";
import { databaseError } from "@/constants/error.constant";

export enum DB {
	MONGODB = "MONGODB",
	NEDB = "NEDB",
}

export type DBI = MongoDBConnection | NeDBConnection;

export class DatabaseFactory {
	private static readonly database: Map<DB, DBI> = new Map<DB, DBI>();

	static getDatabase(dbname: DB): DBI | undefined {
		return this.database.get(dbname);
	}

	static async setDatabase(dbname: DB): Promise<void> {
		switch (dbname) {
			case "MONGODB":
				const mongoDBConnection = new MongoDBConnection();
				this.database.set(dbname, mongoDBConnection);
				break;
			default:
				throw new DatabaseError({
					name: databaseError.DATABASE_NOT_FOUND,
					message: `database ${dbname} is not existed`,
					details: `database ${dbname} is not existed`,
					origin: this.setDatabase.name,
				});
		}
	}
}
