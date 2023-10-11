import { typeS3 } from "@/constants/type.constant";
import { EpisodeRepository } from "@/repositories/episode.repository";
import { MovieRepository } from "@/repositories/movie.repository";
import { MongoDBConnection } from "@/services/databases/mongodb/connection.database";
import mongoose from "mongoose";

// const datas = [
// 	{
// 		id: "65033e36c63b4f74f02b7540",
// 		subtitle: "harry_potter/sub/vi/HarryPotter1-vietsub.vtt",
// 		subtitle_storage: typeS3.MINIO,
// 	},
// 	{
// 		id: "65033e36c63b4f74f02b7546",
// 		subtitle: "harry_potter/sub/vi/HarryPotter2-vietsub.vtt",
// 		subtitle_storage: typeS3.MINIO,
// 	},
// 	{
// 		id: "65033e36c63b4f74f02b754c",
// 		subtitle: "harry_potter/sub/vi/HarryPotter3-vietsub.vtt",
// 		subtitle_storage: typeS3.MINIO,
// 	},
// 	{
// 		id: "65033e36c63b4f74f02b7552",
// 		subtitle: "harry_potter/sub/vi/HarryPotter4-vietsub.vtt",
// 		subtitle_storage: typeS3.MINIO,
// 	},
// 	{
// 		id: "65033e36c63b4f74f02b7558",
// 		subtitle: "harry_potter/sub/vi/HarryPotter5-vietsub.vtt",
// 		subtitle_storage: typeS3.MINIO,
// 	},
// 	{
// 		id: "65033e36c63b4f74f02b755e",
// 		subtitle: "harry_potter/sub/vi/HarryPotter6-vietsub.vtt",
// 		subtitle_storage: typeS3.MINIO,
// 	},
// 	{
// 		id: "65033e36c63b4f74f02b7564",
// 		subtitle: "harry_potter/sub/vi/HarryPotter7_1-vietsub.vtt",
// 		subtitle_storage: typeS3.MINIO,
// 	},
// 	{
// 		id: "65033e36c63b4f74f02b756a",
// 		subtitle: "harry_potter/sub/vi/HarryPotter7_2-vietsub.vtt",
// 		subtitle_storage: typeS3.MINIO,
// 	},
// ];

async function main() {
	const mongoDBConnection = new MongoDBConnection();
	const episodeRepository = new EpisodeRepository(mongoDBConnection);
	const movieRepository = new MovieRepository(mongoDBConnection);

	await movieRepository.getModel().updateMany(
		{},
		{
			$set: {
				trailer_storage: typeS3.GOOGLE_CLOUD,
				cover_storage: typeS3.GOOGLE_CLOUD,
				cover_horizontal_storage: typeS3.GOOGLE_CLOUD,
			},
		}
	);

	await episodeRepository.getModel().updateMany(
		{},
		{
			$set: {
				video_storage: typeS3.GOOGLE_CLOUD,
				poster_storage: typeS3.GOOGLE_CLOUD,
				subtitle_storage: typeS3.GOOGLE_CLOUD,
			},
		}
	);
	// const movieRepository = new MovieRepository(mongoDBConnection);
	// for (let data of datas) {
	// 	await episodeRepository.getModel().findOneAndUpdate(
	// 		{
	// 			_id: new mongoose.Types.ObjectId(data.id),
	// 		},
	// 		{
	// 			$set: {
	// 				subtitle: data.subtitle,
	// 				subtitle_storage: data.subtitle_storage,
	// 			},
	// 		}
	// 	);
	// }
	// console.log("ok");
	// const START = 1;
	// const END = 1000;
	// const ID_MOVIE = "650470be68030bd86b800c23";
	// const array = [...Array(END - START + 1)].map((_, index) => index + 1);
	// for (let index of array) {
	// 	await episodeRepository.getModel().findOneAndUpdate(
	// 		{
	// 			id_movie: new mongoose.Types.ObjectId(ID_MOVIE),
	// 			episode: index,
	// 		},
	// 		{
	// 			skip_intro_time: index < 40 ? 60 * 2 : 60 * 2 + 5,
	// 		}
	// 	);
	// 	console.log(`video ${index} updated`);
	// }
	// console.log("ok");
}

main();
