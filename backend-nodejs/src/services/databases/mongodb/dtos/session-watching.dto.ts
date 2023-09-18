import mongoose, { Document } from "mongoose";

export interface SessionWatchingI extends Document {
	_id: mongoose.Types.ObjectId;
	id_movie: mongoose.Types.ObjectId;
	id_episode: mongoose.Types.ObjectId;
	last_update: Date;
	current_time: number;
}
