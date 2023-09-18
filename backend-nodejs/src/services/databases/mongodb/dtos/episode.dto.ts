import mongoose, { Document } from "mongoose";

export interface EpisodeI extends Document {
	_id: mongoose.Types.ObjectId;
	video: string;
	poster: string;
	video_storage: string;
	poster_storage: string;
	episode: number;
	subtitle: string;
	subtitle_storage: string;
	id_movie: mongoose.Types.ObjectId;
	skip_intro_time: number;
}
