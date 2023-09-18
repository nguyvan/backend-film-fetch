import { Schema } from "mongoose";
import { SessionWatchingI } from "../dtos/session-watching.dto";

const SessionWatchingSchema = new Schema<SessionWatchingI>({
	id_movie: {
		type: Schema.ObjectId,
		unique: true,
	},
	id_episode: Schema.ObjectId,
	last_update: Date,
	current_time: Number,
});

export { SessionWatchingSchema };
