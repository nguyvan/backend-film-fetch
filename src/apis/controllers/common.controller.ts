import { Request, Response, NextFunction } from "@/types/express";
import {
	RequestEpisodeI,
	RequestEpisodesI,
	RequestMovieI,
	RequestSessionCreateOrUpdateI,
	RequestSessionI,
} from "@/apis/dtos/common.dto";
import { MovieRepository } from "@/repositories/movie.repository";
import { MongoDBConnection } from "@/services/databases/mongodb/connection.database";
import { StatusCodes } from "http-status-codes";
import { EpisodeRepository } from "@/repositories/episode.repository";
import { SessionWatchingRepository } from "@/repositories/session-watching.repository";

export class CommonController {
	static async getMovies(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit, search, type }: RequestMovieI =
				req.query as unknown as RequestMovieI;
			const database = req.db! as MongoDBConnection;
			const movieRepository = new MovieRepository(database);
			const movies = await movieRepository.get({
				page: page ? parseInt(page as string) : 0,
				limit: limit ? parseInt(limit as string) : 100,
				search,
				type,
			});
			return res.status(StatusCodes.OK).json({ movies });
		} catch (error) {
			next(error);
		}
	}

	static async getEpisodes(req: Request, res: Response, next: NextFunction) {
		try {
			const { page, limit, id_movie }: RequestEpisodesI =
				req.query as unknown as RequestEpisodeI;
			const database = req.db! as MongoDBConnection;
			const episodeRepository = new EpisodeRepository(database);
			const episodes = await episodeRepository.get({
				id_movie,
				page: page ? parseInt(page as string) : 0,
				limit: limit ? parseInt(limit as string) : 100,
			});
			return res.status(StatusCodes.OK).json({ episodes });
		} catch (error) {
			next(error);
		}
	}

	static async getEpisode(req: Request, res: Response, next: NextFunction) {
		try {
			const { id_movie, episode }: RequestEpisodeI =
				req.query as unknown as RequestEpisodeI;
			const database = req.db! as MongoDBConnection;
			const episodeRepository = new EpisodeRepository(database);
			const ep = await episodeRepository.getByEpisode({
				id_movie,
				episode: episode ? parseInt(episode) : 1,
			});
			return res.status(StatusCodes.OK).json({ episode: ep });
		} catch (error) {
			next(error);
		}
	}

	static async getSession(req: Request, res: Response, next: NextFunction) {
		try {
			const { id, id_movie } = req.query as unknown as RequestSessionI;
			const database = req.db! as MongoDBConnection;
			const sessionWatchingRepository = new SessionWatchingRepository(
				database
			);
			if (id || id_movie) {
				const session = await sessionWatchingRepository.get({
					id,
					id_movie,
				});
				return res.status(StatusCodes.OK).json({ session });
			} else {
				const session = await sessionWatchingRepository.getLastSeen();
				return res.status(StatusCodes.OK).json({ session });
			}
		} catch (error) {
			next(error);
		}
	}

	static async createOrUpdateSession(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		try {
			const { id_episode, id_movie, current_time } =
				req.body as unknown as RequestSessionCreateOrUpdateI;
			const database = req.db! as MongoDBConnection;
			const sessionWatchingRepository = new SessionWatchingRepository(
				database
			);
			await sessionWatchingRepository.createOrUpdate({
				id_movie,
				id_episode,
				current_time: current_time ? parseInt(current_time) : 0,
			});
		} catch (error) {
			next(error);
		}
	}
}
