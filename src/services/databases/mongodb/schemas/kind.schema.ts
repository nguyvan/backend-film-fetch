import { KindI } from "@/services/databases/mongodb/dtos/kind.dto";
import { Schema } from "mongoose";

const KindSchema = new Schema<KindI>({
	name: String,
	slug: String,
});

export { KindSchema };
