import { SessionWatchingRepository } from "@/repositories/session-watching.repository";
import { MongoDBConnection } from "@/services/databases/mongodb/connection.database";

async function main() {
	const database = new MongoDBConnection();
	const sessionWatchingRepository = new SessionWatchingRepository(database);

	const data = {
		id_movie: "650470bd68030bd86b800bf1",
		id_episode: "650470be68030bd86b800bf7",
		current_time: 4200,
	};

	await sessionWatchingRepository.createOrUpdate(data);
	console.log("ok");
}

main();
