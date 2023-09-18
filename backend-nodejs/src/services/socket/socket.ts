import { Server } from "socket.io";
import http from "http";
import {
	CreateSessionWatchingI,
	SessionWatchingRepository,
} from "@/repositories/session-watching.repository";
import { DB, DatabaseFactory } from "@/services/databases/database-factory";
import { MongoDBConnection } from "../databases/mongodb/connection.database";

export class SocketService {
	private readonly io: Server;
	constructor(httpServer: http.Server) {
		this.io = new Server(httpServer, {
			cors: {},
			allowEIO3: true,
			transports: ["websocket", "polling"],
		});
	}

	init() {
		this.io.on("connection", (socket) => {
			socket.on(
				"save_session",
				async ({
					id_movie,
					id_episode,
					current_time,
				}: CreateSessionWatchingI) => {
					if (!DatabaseFactory.getDatabase(DB.MONGODB)) {
						DatabaseFactory.setDatabase(DB.MONGODB);
					}
					const database = DatabaseFactory.getDatabase(
						DB.MONGODB
					) as MongoDBConnection;
					const sessionWatchingRepository =
						new SessionWatchingRepository(database);
					if (id_movie && id_episode && current_time) {
						await sessionWatchingRepository.createOrUpdate({
							id_movie,
							id_episode,
							current_time,
						});
					}
				}
			);
		});
	}
}
