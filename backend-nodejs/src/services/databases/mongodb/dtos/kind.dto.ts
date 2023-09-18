import mongoose, { Document } from "mongoose";

export interface KindI extends Document {
	_id: mongoose.Types.ObjectId;
	name: string;
	slug: string;
}
