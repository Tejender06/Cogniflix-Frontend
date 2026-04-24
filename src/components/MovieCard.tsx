import { useState } from "react";
import "./moviecard.css";
import { type Movie, postInteraction } from "../services/movieService";

interface Props {
  movie: Movie;
  onInteraction?: () => void;
}

export default function MovieCard({ movie, onInteraction }: Props) {
  const [loading, setLoading] = useState(false);

  const handleInteraction = async (type: 'watch' | 'like' | 'rate') => {
    try {
      setLoading(true);
      await postInteraction(movie.id, type);
      if (onInteraction) onInteraction();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="movie-card" id={`movie-${movie.id}`}>
      <img 
        src={movie.poster_url || "https://via.placeholder.com/300x450?text=No+Poster"} 
        alt={movie.title} 
        loading="lazy"
      />
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <div className="movie-actions">
          <button disabled={loading} onClick={() => handleInteraction('watch')}>Watch</button>
          <button disabled={loading} onClick={() => handleInteraction('like')}>Like</button>
          <button disabled={loading} onClick={() => handleInteraction('rate')}>Rate</button>
        </div>
      </div>
    </div>
  );
}