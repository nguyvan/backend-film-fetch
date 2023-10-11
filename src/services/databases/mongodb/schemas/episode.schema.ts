import { EpisodeI } from "@/services/databases/mongodb/dtos/episode.dto";
import { Schema } from "mongoose";

const EpisodeSchema = new Schema<EpisodeI>({
	video: String,
	poster: String,
	video_storage: String,
	poster_storage: String,
	id_movie: Schema.ObjectId,
	subtitle: String,
	subtitle_storage: String,
	episode: Number,
	skip_intro_time: Number,
});

export { EpisodeSchema };
