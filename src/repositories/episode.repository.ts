import { MongoDBConnection } from "@/services/databases/mongodb/connection.database";
import { EpisodeI } from "@/services/databases/mongodb/dtos/episode.dto";
import { getURL } from "@/utils/getURL";
import mongoose, { Model } from "mongoose";

interface EpisodeCreateI {
	video: string;
	poster?: string | null;
	video_storage?: string | null;
	poster_storage?: string | null;
	id_movie: string;
	episode: number;
	subtitle?: string | null;
	subtitle_storage?: string;
}

interface EpisodeGetI {
	id_movie: string;
	page: number;
	limit: number;
}

interface EpisodeGetByEpI {
	id_movie: string;
	episode: number;
}

export class EpisodeRepository {
	private readonly model: Model<EpisodeI>;
	constructor(dbConnection: MongoDBConnection) {
		this.model = dbConnection.get("episode") as Model<EpisodeI>;
	}

	async create({
		video,
		poster,
		video_storage,
		poster_storage,
		id_movie,
		episode,
		subtitle,
		subtitle_storage,
	}: EpisodeCreateI) {
		return await this.model
			.create({
				video,
				poster,
				video_storage,
				poster_storage,
				id_movie: new mongoose.Types.ObjectId(id_movie),
				episode,
				subtitle,
				subtitle_storage,
			})
			.then((episode) => {
				return episode._id.toString();
			});
	}

	async get({ id_movie, page, limit }: EpisodeGetI) {
		return await this.model
			.aggregate([
				{
					$match: {
						id_movie: new mongoose.Types.ObjectId(id_movie),
					},
				},
				{
					$sort: {
						episode: 1,
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
						video: 1,
						poster: 1,
						video_storage: 1,
						poster_storage: 1,
						episode: 1,
						subtitle: 1,
						subtitle_storage: 1,
						id_movie: 1,
						skip_intro_time: 1,
					},
				},
			])
			.then((episodes) =>
				Promise.all(
					episodes.map(async (episode) => {
						const video = await getURL(
							episode.video_storage,
							episode.video
						);
						const poster = await getURL(
							episode.poster_storage,
							episode.poster
						);
						const subtitle = await getURL(
							episode.subtitle_storage,
							episode.subtitle
						);
						return {
							...episode,
							video,
							poster,
							subtitle,
						};
					})
				)
			);
	}

	async getByEpisode({ id_movie, episode }: EpisodeGetByEpI) {
		return await this.model
			.findOne({
				id_movie: new mongoose.Types.ObjectId(id_movie),
				episode: episode,
			})
			.then(async (ep) => {
				if (ep) {
					const id = ep?._id;
					const video = await getURL(ep!.video_storage, ep!.video);
					const poster = await getURL(ep!.poster_storage, ep!.poster);
					const subtitle = await getURL(
						ep!.subtitle_storage,
						ep!.subtitle
					);
					return {
						...ep.toJSON(),
						id,
						video,
						poster,
						subtitle,
					};
				}
				return null;
			});
	}

	async numberEpisodeByMovide(id_movie: string) {
		return await this.model
			.aggregate([
				{
					$match: {
						id_movie: new mongoose.Types.ObjectId(id_movie),
					},
				},
				{
					$count: "nb_episodes",
				},
			])
			.then((value) => value.at(0)!.nb_episodes as number);
	}

	getModel() {
		return this.model;
	}
}
