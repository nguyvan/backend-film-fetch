import { MongoDBConnection } from "@/services/databases/mongodb/connection.database";
import { MovieI } from "@/services/databases/mongodb/dtos/movie.dto";
import { typeMovie } from "@/types/movie/movie.type";
import { getURL } from "@/utils/getURL";
import { Model } from "mongoose";

interface KindI {
	name: string;
	slug: string;
}

export interface MovieCreateI {
	name: string;
	slug: string;
	kind?: KindI[];
	description: string;
	trailer: string;
	trailer_storage?: string;
	cover: string;
	cover_storage?: string;
	type: typeMovie;
}

export interface MovieGetI {
	page: number;
	limit: number;
	search?: string;
	type: typeMovie;
}

export interface MovieReturnI {
	id: string;
	name: string;
	description: string;
	kind: KindI;
	nb_episodes: number;
	cover: string;
	trailer: string;
}

export class MovieRepository {
	private readonly model: Model<MovieI>;
	constructor(dbConnection: MongoDBConnection) {
		this.model = dbConnection.get("movie") as Model<MovieI>;
	}

	async create({
		name,
		slug,
		kind,
		description,
		trailer,
		trailer_storage,
		cover,
		type,
		cover_storage,
	}: MovieCreateI) {
		return await this.model
			.create({
				name,
				slug,
				kind,
				description,
				trailer,
				trailer_storage,
				cover,
				cover_storage,
				type,
			})
			.then((movie) => {
				return movie._id.toString();
			});
	}

	async get({
		page,
		limit,
		search,
		type,
	}: MovieGetI): Promise<MovieReturnI[]> {
		return await this.model
			.aggregate([
				{
					$match: {
						$or: [
							{
								slug: search
									? {
											$regex: new RegExp(
												`.*(${search.toLowerCase()}).*`,
												"i"
											),
									  }
									: {
											$ne: null,
									  },
							},
							{
								name: search
									? {
											$regex: new RegExp(
												`.*(${search.toLowerCase()}).*`,
												"i"
											),
									  }
									: {
											$ne: null,
									  },
							},
						],
						type: type
							? type
							: {
									$ne: null,
							  },
					},
				},
				{
					$lookup: {
						from: "episodes",
						localField: "_id",
						foreignField: "id_movie",
						as: "episodes",
					},
				},
				{
					$skip: page * limit,
				},
				{
					$limit: limit,
				},
				{
					$project: {
						_id: 0,
						id: "$_id",
						name: 1,
						slug: 1,
						kind: 1,
						description: 1,
						trailer: 1,
						nb_episodes: {
							$size: "$episodes",
						},
						trailer_storage: 1,
						cover: 1,
						cover_storage: 1,
						cover_horizontal: 1,
						cover_horizontal_storage: 1,
					},
				},
			])
			.then((movies) =>
				Promise.all(
					movies.map(async (movie) => {
						const trailer = await getURL(
							movie.trailer_storage,
							movie.trailer
						);
						const cover = await getURL(
							movie.cover_storage,
							movie.cover
						);
						const cover_horizontal = await getURL(
							movie.cover_horizontal_storage,
							movie.cover_horizontal
						);
						return {
							...movie,
							trailer,
							cover,
							cover_horizontal,
						};
					})
				)
			);
	}

	getModel() {
		return this.model;
	}
}
