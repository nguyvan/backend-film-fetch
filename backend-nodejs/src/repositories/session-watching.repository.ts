import { MongoDBConnection } from "@/services/databases/mongodb/connection.database";
import { SessionWatchingI } from "@/services/databases/mongodb/dtos/session-watching.dto";
import { getURL } from "@/utils/getURL";
import mongoose, { Model } from "mongoose";
import { EpisodeRepository } from "./episode.repository";

export interface CreateSessionWatchingI {
	id_movie: string;
	id_episode: string;
	current_time: number;
}

interface GetSessionWatchingI {
	id?: string;
	id_movie?: string;
}

interface KindI {
	name: string;
	slug: string;
}

interface ReturnEpisodeI {
	id: string;
	video: string | null;
	poster: string | null;
	video_storage: string;
	poster_storage: string;
	episode: number;
	subtitle: string | null;
	subtitle_storage: string;
	id_movie: string;
}

interface ReturnMovieI {
	id: string;
	name: string;
	slug: string;
	kind: KindI[];
	description: string;
	trailer: string | null;
	trailer_storage: string;
	cover: string | null;
	cover_storage: string;
	type: string;
	nb_episode: number;
}

interface ReturnSessionWatchingI {
	id: string;
	current_time: number;
	last_update: string;
	movie: ReturnMovieI;
	episode: ReturnEpisodeI;
}

export class SessionWatchingRepository {
	private readonly model: Model<SessionWatchingI>;
	private readonly espisodeRes: EpisodeRepository;
	constructor(dbConnection: MongoDBConnection) {
		this.model = dbConnection.get(
			"session_watching"
		) as Model<SessionWatchingI>;
		this.espisodeRes = new EpisodeRepository(dbConnection);
	}

	async createOrUpdate({
		id_movie,
		id_episode,
		current_time,
	}: CreateSessionWatchingI) {
		const isExised = !!(await this.model.findOne({
			id_movie: new mongoose.Types.ObjectId(id_movie),
		}));
		if (isExised) {
			await this.model.findOneAndUpdate(
				{
					id_movie: new mongoose.Types.ObjectId(id_movie),
				},
				{
					$set: {
						id_episode: new mongoose.Types.ObjectId(id_episode),
						current_time,
						last_update: new Date(),
					},
				}
			);
		} else {
			await this.model.create({
				id_movie,
				id_episode,
				current_time,
				last_update: new Date(),
			});
		}
	}

	async get({ id, id_movie }: GetSessionWatchingI) {
		try {
			return await this.model
				.aggregate([
					{
						$match: {
							$or: [
								{
									_id: new mongoose.Types.ObjectId(id),
								},
								{
									id_movie: new mongoose.Types.ObjectId(
										id_movie
									),
								},
							],
						},
					},
					{
						$lookup: {
							from: "movies",
							localField: "id_movie",
							foreignField: "_id",
							as: "movie",
						},
					},
					{
						$lookup: {
							from: "episodes",
							localField: "id_episode",
							foreignField: "_id",
							as: "episode",
						},
					},
					{
						$unwind: "$movie",
					},
					{
						$unwind: "$episode",
					},
					{
						$skip: 0,
					},
					{
						$limit: 1,
					},
					{
						$project: {
							id: "$_id",
							_id: 0,
							id_movie: 1,
							id_episode: 1,
							current_time: 1,
							last_update: 1,
							movie: {
								id: "$movie._id",
								name: "$movie.name",
								slug: "$movie.slug",
								kind: "$movie.kind",
								description: "$movie.description",
								trailer: "$movie.trailer",
								trailer_storage: "$movie.trailer_storage",
								cover: "$movie.cover",
								cover_storage: "$movie.cover_storage",
								type: "$movie.type",
							},
							episode: {
								id: "$episode._id",
								video: "$episode.video",
								poster: "$episode.poster",
								video_storage: "$episode.video_storage",
								poster_storage: "$episode.poster_storage",
								episode: "$episode.episode",
								subtitle: "$episode.subtitle",
								subtitle_storage: "$episode.subtitle_storage",
								id_movie: "$episode.id_movie",
							},
						},
					},
				])
				.then(async (sessions: ReturnSessionWatchingI[]) => {
					if (sessions.length) {
						const session = sessions.at(0)!;
						const movie = session.movie!;
						const episode = session.episode!;
						movie.trailer = await getURL(
							movie.trailer_storage,
							movie.trailer as string
						);
						movie.cover = await getURL(
							movie.cover_storage,
							movie.cover as string
						);

						movie.nb_episode =
							await this.espisodeRes.numberEpisodeByMovide(
								movie.id
							);

						episode.poster = await getURL(
							episode.poster_storage,
							episode.poster as string
						);

						episode.video = await getURL(
							episode.video_storage,
							episode.video as string
						);

						episode.subtitle = await getURL(
							episode.subtitle_storage,
							episode.subtitle as string
						);

						session.movie = movie;
						session.episode = episode;
						return session;
					}
					return null;
				});
		} catch {
			return null;
		}
	}

	async getLastSeen() {
		try {
			return await this.model
				.aggregate([
					{
						$lookup: {
							from: "movies",
							localField: "id_movie",
							foreignField: "_id",
							as: "movie",
						},
					},
					{
						$lookup: {
							from: "episodes",
							localField: "id_episode",
							foreignField: "_id",
							as: "episode",
						},
					},
					{
						$unwind: "$movie",
					},
					{
						$unwind: "$episode",
					},
					{
						$sort: {
							last_update: -1,
						},
					},
					{
						$skip: 0,
					},
					{
						$limit: 1,
					},
					{
						$project: {
							id: "$_id",
							_id: 0,
							id_movie: 1,
							id_episode: 1,
							current_time: 1,
							last_update: 1,
							movie: {
								id: "$movie._id",
								name: "$movie.name",
								slug: "$movie.slug",
								kind: "$movie.kind",
								description: "$movie.description",
								trailer: "$movie.trailer",
								trailer_storage: "$movie.trailer_storage",
								cover: "$movie.cover",
								cover_storage: "$movie.cover_storage",
								type: "$movie.type",
							},
							episode: {
								id: "$episode._id",
								video: "$episode.video",
								poster: "$episode.poster",
								video_storage: "$episode.video_storage",
								poster_storage: "$episode.poster_storage",
								episode: "$episode.episode",
								subtitle: "$episode.subtitle",
								subtitle_storage: "$episode.subtitle_storage",
								id_movie: "$episode.id_movie",
								skip_intro_time: "$episode.skip_intro_time",
							},
						},
					},
				])
				.then(async (sessions: ReturnSessionWatchingI[]) => {
					if (sessions.length) {
						const session = sessions.at(0)!;
						const movie = session.movie!;
						const episode = session.episode!;
						movie.trailer = await getURL(
							movie.trailer_storage,
							movie.trailer as string
						);
						movie.cover = await getURL(
							movie.cover_storage,
							movie.cover as string
						);

						movie.nb_episode =
							await this.espisodeRes.numberEpisodeByMovide(
								movie.id
							);

						episode.poster = await getURL(
							episode.poster_storage,
							episode.poster as string
						);

						episode.video = await getURL(
							episode.video_storage,
							episode.video as string
						);

						episode.subtitle = await getURL(
							episode.subtitle_storage,
							episode.subtitle as string
						);

						session.movie = movie;
						session.episode = episode;
						return session;
					}
					return null;
				});
		} catch (err) {
			console.log(err);
			return null;
		}
	}
}
