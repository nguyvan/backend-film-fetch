import { typeMovie } from "@/types/movie/movie.type";

export interface RequestI {
	page?: string;
	limit?: string;
	search?: string;
}

export interface RequestMovieI extends RequestI {
	type: typeMovie;
}

export interface RequestEpisodesI extends RequestI {
	id_movie: string;
}

export interface RequestEpisodeI {
	id_movie: string;
	episode: string;
}

export interface RequestSessionI {
	id_movie?: string;
	id?: string;
}

export interface RequestSessionCreateOrUpdateI {
	id_movie: string;
	current_time: string;
	id_episode: string;
}
