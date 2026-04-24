import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="logo" onClick={() => navigate('/dashboard')} style={{cursor: 'pointer'}}>COGNIFLIX</div>
      <ul className="navbar-links">
        <li onClick={() => navigate('/dashboard')}>Home</li>
        <li onClick={() => navigate('/dashboard')}>Movies</li>
        <li onClick={() => navigate('/dashboard')}>TV Shows</li>
        <li onClick={() => navigate('/dashboard')}>New & Popular</li>
        <li onClick={() => navigate('/dashboard')}>My List</li>
      </ul>
    </header>
  );
}