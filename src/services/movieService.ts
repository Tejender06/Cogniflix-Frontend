import api from "./api";

export type Movie = {
  id: string;
  title: string;
  poster_url: string;
  popularity_score?: number;
  genre?: string;
  language?: string;
  description?: string;
  emotion_name?: string;
  region?: string;
};

type MovieResponse = {
  movies: Movie[];
};

export const fetchMovieById = async (id: string): Promise<Movie> => {
  const res = await api.get<{movie: Movie}>(`/api/movies/${id}`);
  return res.data.movie;
};

export const fetchGenres = async (): Promise<string[]> => {
  const res = await api.get<{genres: string[]}>("/api/movies/genres");
  return res.data.genres;
};

export const fetchMovies = async (genre?: string): Promise<Movie[]> => {
  const params = genre ? { genre } : {};
  const res = await api.get<MovieResponse>("/api/movies", { params });
  return res.data.movies;
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  const res = await api.get<{movies: Movie[]}>("/api/movies/trending");
  return res.data.movies;
};

export const fetchRecommendations = async (): Promise<Movie[]> => {
  const res = await api.get<{data: Movie[]}>("/api/recommendations");
  return res.data.data;
};

export const fetchHistory = async (): Promise<Movie[]> => {
  const res = await api.get<{data: Movie[]}>("/api/interactions/history");
  return res.data.data;
};

export const postInteraction = async (content_id: string, interaction_type: 'watch' | 'like' | 'rate') => {
  const res = await api.post("/api/interactions", { content_id, interaction_type });
  return res.data;
};