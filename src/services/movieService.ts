import api from "./api";

export type Movie = {
  id: string;
  title: string;
  poster_url: string;
  backdrop_url?: string;
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

export const fetchMovies = async (
  genre?: string,
  search?: string,
  page = 1,
  limit = 20
): Promise<{ movies: Movie[]; total: number; page: number; limit: number }> => {
  const params: Record<string, string | number> = { page, limit };
  if (genre) params.genre = genre;
  if (search) params.search = search;
  const res = await api.get<{ movies: Movie[]; total: number; page: number; limit: number }>(
    "/api/movies",
    { params }
  );
  return res.data;
};

export const fetchTvShows = async (): Promise<Movie[]> => {
  const res = await api.get<MovieResponse>("/api/tv-shows");
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

export const fetchSavedMovies = async (): Promise<Movie[]> => {
  const res = await api.get<{data: Movie[]}>("/api/interactions/saved");
  return res.data.data;
};

export const fetchSimilarMovies = async (id: string): Promise<Movie[]> => {
  const res = await api.get<{movies: Movie[]}>(`/api/movies/${id}/similar`);
  return res.data.movies;
};

export const postInteraction = async (content_id: string, interaction_type: 'watch' | 'like' | 'rate' | 'save', score?: number) => {
  const res = await api.post("/api/interactions", { content_id, interaction_type, score });
  return res.data;
};

export const deleteSavedInteraction = async (content_id: string) => {
  const res = await api.delete(`/api/interactions/saved/${content_id}`);
  return res.data;
};