import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieById, postInteraction, fetchSimilarMovies, fetchSavedMovies, deleteSavedInteraction } from "../services/movieService";
import type { Movie } from "../services/movieService";
import { ChevronLeft, Play, ThumbsUp, Star, Plus, Check } from "lucide-react";
import MovieRow from "../components/MovieRow";
import SkeletonLoader from "../components/SkeletonLoader";
import "./movieinfo.css";

export default function MovieInfoPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);
        const [movieData, similarData, savedData] = await Promise.all([
          fetchMovieById(id),
          fetchSimilarMovies(id),
          fetchSavedMovies()
        ]);
        setMovie(movieData);
        setSimilarMovies(similarData);
        
        // Reset interaction states when movie changes
        setLiked(false);
        setSaved(savedData.some(m => m.id === movieData.id));
        setRating(0);
      } catch (err) {
        console.error("Failed to load movie data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleInteraction = async (type: 'watch' | 'like' | 'rate' | 'save', score?: number) => {
    if (!movie) return;
    try {
      setActionLoading(true);

      if (type === 'save') {
        if (saved) {
          await deleteSavedInteraction(movie.id);
          setSaved(false);
        } else {
          await postInteraction(movie.id, type, score);
          setSaved(true);
        }
        return;
      }

      await postInteraction(movie.id, type, score);
      
      if (type === 'like') setLiked(true);
      if (type === 'rate' && score) setRating(score);
      
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="movie-info-page" style={{ paddingTop: '70px', paddingLeft: '4%', paddingRight: '4%' }}>
        <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
          <SkeletonLoader type="card" width="300px" height="450px" />
          <div style={{ flex: 1 }}>
            <SkeletonLoader type="title" width="60%" height="40px" style={{ marginBottom: '20px' }} />
            <SkeletonLoader type="text" width="40%" style={{ marginBottom: '30px' }} />
            <SkeletonLoader type="text" width="100%" />
            <SkeletonLoader type="text" width="100%" />
            <SkeletonLoader type="text" width="80%" style={{ marginBottom: '40px' }} />
            <div style={{ display: 'flex', gap: '15px' }}>
              <SkeletonLoader type="text" width="120px" height="40px" />
              <SkeletonLoader type="text" width="120px" height="40px" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!movie) return <div className="loader" style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-secondary)' }}>Movie not found.</div>;

  return (
    <div 
      className="movie-info-page"
      style={{
        backgroundImage: `linear-gradient(to right, rgba(11, 11, 11, 1) 20%, rgba(11, 11, 11, 0.7) 60%, rgba(11, 11, 11, 0.2) 100%), linear-gradient(to top, var(--bg-primary) 0%, transparent 40%), url('${movie.poster_url?.replace('/w500', '/original')}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'top right',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh'
      }}
    >
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ChevronLeft size={24} /> Back
      </button>

      <div className="movie-info-hero">
        <div className="movie-info-poster">
          <img 
            src={movie.poster_url?.replace('/w500', '/original') || "https://via.placeholder.com/400x600?text=No+Poster"} 
            alt={movie.title} 
          />
        </div>

        <div className="movie-info-details">
          <h1 className="movie-title">{movie.title}</h1>
          
          <div className="movie-meta">
            <span className="match-score">{movie.popularity_score ? Math.round(movie.popularity_score * 10) : 85}% Match</span>
            <span className="region">{movie.region || 'Global'}</span>
            <span className="language">{movie.language?.toUpperCase() || 'EN'}</span>
            {movie.genre && <span className="genre-tag">{movie.genre}</span>}
          </div>

          <p className="movie-description">
            {movie.description || "No description available for this title."}
          </p>

          <div className="movie-actions-large">
            <button 
              className="btn-primary" 
              disabled={actionLoading} 
              onClick={() => handleInteraction('watch')}
            >
              <Play size={20} fill="currentColor" /> Watch Now
            </button>
            <button 
              className={`btn-secondary ${liked ? 'liked' : ''}`} 
              disabled={actionLoading || liked} 
              onClick={() => handleInteraction('like')}
            >
              <ThumbsUp size={20} fill={liked ? "currentColor" : "none"} /> {liked ? 'Liked' : 'Like'}
            </button>
            <button 
              className="btn-secondary" 
              disabled={actionLoading} 
              onClick={() => handleInteraction('save')}
            >
              {saved ? <Check size={20} /> : <Plus size={20} />} {saved ? 'Remove from List' : 'Add to List'}
            </button>
          </div>

          <div className="rating-container">
            <p style={{ margin: '10px 0 5px', fontSize: '0.9rem', color: '#aaa' }}>Rate this title</p>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  size={24}
                  className="star-icon"
                  fill={star <= rating ? "#ffcc00" : "none"}
                  color={star <= rating ? "#ffcc00" : "#666"}
                  onClick={() => handleInteraction('rate', star)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {similarMovies.length > 0 && (
        <div className="similar-movies-section">
          <MovieRow title="More Like This" movies={similarMovies} />
        </div>
      )}
    </div>
  );
}
