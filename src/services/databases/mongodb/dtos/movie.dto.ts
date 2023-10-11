import mongoose, { Document } from "mongoose";
import { KindI } from "@/services/databases/mongodb/dtos/kind.dto";
import { typeMovie } from "@/types/movie/movie.type";

export interface MovieI extends Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	slug: string;
	kind: KindI[];
	description: string;
	trailer: string;
	trailer_storage?: string;
	cover: string;
	cover_storage?: string;
	cover_horizontal: string;
	cover_horizontal_storage?: string;
	type: typeMovie;
}
