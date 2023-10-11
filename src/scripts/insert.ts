import { MovieRepository } from "@/repositories/movie.repository";
import { MongoDBConnection } from "@/services/databases/mongodb/connection.database";
import { EpisodeRepository } from "@/repositories/episode.repository";
import { typeS3 } from "@/constants/type.constant";
import { S3Factory } from "@/services/file-storage/s3-factory";
import { typeMovie } from "@/types/movie/movie.type";

async function main() {
	const mongoDBConnection = new MongoDBConnection();
	const movieRepository = new MovieRepository(mongoDBConnection);
	const episodeRepository = new EpisodeRepository(mongoDBConnection);

	const START: number = 401;
	const END: number = 1000;
	const ID_MOVIE: string = "650470be68030bd86b800c23";
	const arr = [...Array(END - START + 1)].map((_, index) => START + index);

	for (const index of arr) {
		const data = {
			id_movie: ID_MOVIE,
			video: `one_piece/one_piece_serie/video/${index}.mp4`,
			video_storage: typeS3.MINIO,
			poster: null,
			poster_storage: typeS3.MINIO,
			episode: index,
		};
		await episodeRepository.create(data);
		console.log(`episode ${index} inserted`);
	}
	console.log("ok");
}

main();
