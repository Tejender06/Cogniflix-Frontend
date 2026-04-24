import { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import MovieRow from "../components/MovieRow";
import { fetchMovies, fetchTrendingMovies, fetchRecommendations, fetchHistory } from "../services/movieService";
import type { Movie } from "../services/movieService";
import "./dashboard.css";

const GENRES = ["Action", "Drama", "Comedy", "Thriller", "Horror", "Romance", "Adventure", "Sci-Fi"];

export default function DashboardPage() {
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [history, setHistory] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [recData, trendData, histData, filterData] = await Promise.all([
        fetchRecommendations(),
        fetchTrendingMovies(),
        fetchHistory(),
        fetchMovies(selectedGenre || undefined)
      ]);

      setRecommended(recData || []);
      setTrending(trendData || []);
      setHistory(histData || []);
      setFilteredMovies(filterData || []);
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
            {GENRES.map(g => (
              <button 
                key={g} 
                className={`chip ${selectedGenre === g.toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedGenre(g.toLowerCase())}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {selectedGenre ? (
          <MovieRow title={`Movies: ${selectedGenre}`} movies={filteredMovies} onInteraction={loadData} />
        ) : (
          <>
            {recommended.length > 0 && <MovieRow title="Recommended For You" movies={recommended} onInteraction={loadData} />}
            {trending.length > 0 && <MovieRow title="Trending Now" movies={trending} onInteraction={loadData} />}
            {history.length > 0 && <MovieRow title="Watch Again" movies={history} onInteraction={loadData} />}
            <MovieRow title="Popular" movies={filteredMovies} onInteraction={loadData} />
          </>
        )}
      </div>
    </div>
  );
}