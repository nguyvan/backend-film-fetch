import { MovieI } from "@/services/databases/mongodb/dtos/movie.dto";
import { Schema } from "mongoose";

const MovieSchema = new Schema<MovieI>({
	name: String,
	cover: String,
	description: String,
	kind: [
		{
			name: String,
			slug: String,
		},
	],
	trailer: String,
	trailer_storage: String,
	slug: String,
	cover_storage: String,
	type: String,
});

export { MovieSchema };
