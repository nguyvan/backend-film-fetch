import { DATABASE_CONFIG } from "@/configs/database.config";
import { databaseError } from "@/constants/error.constant";
import { DatabaseError } from "@/errors/database.error";
import mongoose, { Connection, Model } from "mongoose";
import { MovieSchema } from "./schemas/movie.schema";
import { KindSchema } from "./schemas/kind.schema";
import { EpisodeSchema } from "./schemas/episode.schema";
import { SessionWatchingSchema } from "./schemas/session-watching.schema";

const schemas = [
	{
		name: "movie",
		schema: MovieSchema,
	},
	{
		name: "kind",
		schema: KindSchema,
	},
	{
		name: "episode",
		schema: EpisodeSchema,
	},
	{
		name: "session_watching",
		schema: SessionWatchingSchema,
	},
];

export class MongoDBConnection {
	private conn: Connection;
	constructor() {
		this.conn = this.connect(DATABASE_CONFIG.URI_MONGODB_CONNECTION);
		this.init();
	}

	connect(uri: string): Connection {
		try {
			return mongoose.createConnection(uri);
		} catch {
			throw new DatabaseError({
				name: databaseError.CONNECTION_ERROR,
				details: "invalid uri",
				origin: this.connect.name,
				message: "MongoDB connection error",
			});
		}
	}

	init(): void {
		for (const schema of schemas) {
			this.conn.model(schema.name, schema.schema);
		}
	}

	get(model: string) {
		const schema = schemas.find((value) => value.name === model)?.schema;
		return this.conn.model(model, schema);
	}

	getNames() {
		return this.conn.modelNames();
	}
}
