import { useNavigate, useLocation } from "react-router-dom";
import "./moviecard.css";
import { type Movie } from "../services/movieService";
import { useMovieContext } from "../context/MovieContext";

interface Props {
  movie: Movie;
  onInteraction?: () => void;
}

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const movieContext = useMovieContext();

  const handleClick = () => {
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      movieContext.setHeroMovie(movie);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate(`/movie/${movie.id}`);
    }
  };

  return (
    <div 
      className="movie-card" 
      id={`movie-${movie.id}`}
      onClick={handleClick}
    >
      <img 
        src={movie.poster_url || "https://via.placeholder.com/300x450?text=No+Poster"} 
        alt={movie.title} 
        loading="lazy"
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
      </div>
    </div>
  );
}