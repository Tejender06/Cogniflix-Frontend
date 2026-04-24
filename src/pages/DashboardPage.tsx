import { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import { fetchMovies, fetchTrendingMovies, fetchRecommendations, fetchHistory, fetchGenres } from "../services/movieService";
import type { Movie } from "../services/movieService";
import "./dashboard.css";

export default function DashboardPage() {
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [history, setHistory] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [recData, trendData, histData, filterData, genresData] = await Promise.all([
        fetchRecommendations(),
        fetchTrendingMovies(),
        fetchHistory(),
        fetchMovies(selectedGenre || undefined),
        fetchGenres()
      ]);

      setRecommended(recData || []);
      setTrending(trendData || []);
      setHistory(histData || []);
      setFilteredMovies(filterData || []);
      
      // Only set genres if not already set to avoid UI jumping, or just update it
      if (genresData && genresData.length > 0) {
        // limit to top 15 genres or so to avoid clutter if too many
        setGenres(genresData.slice(0, 15));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedGenre]);

  if (loading && !filteredMovies.length) return <div className="loader">Loading...</div>;

  const heroMovie = trending[0] || recommended[0] || filteredMovies[0];

  return (
    <div className="dashboard">
      {/* HERO */}
      {heroMovie && <HeroBanner movie={heroMovie} />}

      {/* NETFLIX STYLE ROWS */}
      <div className="rows">
        
        {/* Genre Filter UI */}
        <div className="genre-filter">
          <h3>Browse by Genre</h3>
          <div className="genre-chips">
            <button 
              className={`chip ${!selectedGenre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(null)}
            >
              All
            </button>
            {genres.map(g => (
              <button 
                key={g} 
                className={`chip ${selectedGenre === g.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedGenre(g.toLowerCase())}
              >
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {selectedGenre ? (
          <MovieRow title={`Movies: ${selectedGenre}`} movies={filteredMovies} />
        ) : (
          <>
            {recommended.length > 0 && <MovieRow title="Recommended For You" movies={recommended} />}
            {trending.length > 0 && <MovieRow title="Trending Now" movies={trending} />}
            {history.length > 0 && <MovieRow title="Watch Again" movies={history} />}
            <MovieRow title="Popular" movies={filteredMovies} />
          </>
        )}
      </div>
    </div>
  );
}