import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchMovies } from "../services/movieService";
import type { Movie } from "../services/movieService";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";
import { Search, LogOut } from "lucide-react";
import "./navbar.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await fetchMovies(undefined, searchQuery);
          setSearchResults(results.slice(0, 5));
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResultClick = (id: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
    navigate(`/movie/${id}`);
  };

  const handleLogout = async () => {
    await logoutUser();
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="logo" onClick={() => navigate('/dashboard')}>COGNIFLIX</div>
      <ul className="navbar-links">
        <li className={isActive('/dashboard') ? 'active' : ''} onClick={() => navigate('/dashboard')}>Home</li>
        <li className={isActive('/movies') ? 'active' : ''} onClick={() => navigate('/movies')}>Movies</li>
        <li className={isActive('/tv') ? 'active' : ''} onClick={() => navigate('/tv')}>TV Shows</li>
        <li className={isActive('/new') ? 'active' : ''} onClick={() => navigate('/new')}>New & Popular</li>
        <li className={isActive('/my-list') ? 'active' : ''} onClick={() => navigate('/my-list')}>My List</li>
      </ul>
      <div className="navbar-actions">
        <div className="navbar-search-container">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Titles, people, genres" 
            className={`navbar-search ${isSearching || searchQuery ? 'active' : ''}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map(movie => (
                <div key={movie.id} className="search-result-item" onClick={() => handleResultClick(movie.id)}>
                  <img src={movie.poster_url || "https://via.placeholder.com/40x60"} alt={movie.title} />
                  <span>{movie.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {user && (
          <div className="profile-menu">
            <span className="profile-name">{user.name || "User"}</span>
            <LogOut className="logout-icon" size={20} onClick={handleLogout} />
          </div>
        )}
      </div>
    </header>
  );
}