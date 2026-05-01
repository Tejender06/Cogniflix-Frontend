/*
FILE: MovieRow.tsx

PURPOSE:
Displays a horizontal scrollable row of movies.

FLOW:
Component -> API Call -> Backend -> Response -> UI Render

USED BY:
DashboardPage.tsx

NEXT FLOW:
MovieCard.tsx

*/
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import "./movierow.css";

import type { Movie } from "../services/movieService";

interface MovieRowProps {
  title: string;
  movies: Movie[];
  exploreUrl?: string;
}

export default function MovieRow({ title, movies, exploreUrl }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: "left" | "right") => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="mrow">
      <div className="mrow__header">
        <h2 className="mrow__title">{title}</h2>
        <button 
          className="mrow__see-all" 
          onClick={() => {
            if (exploreUrl) navigate(exploreUrl);
            else window.scrollTo({top: 0, behavior: 'smooth'});
          }}
        >
          Explore All {'>'}
        </button>
      </div>

      <div className="mrow__track-wrap group">
        <ChevronLeft 
          className={`sliderArrow left ${!isMoved && "hidden"}`} 
          onClick={() => handleClick("left")} 
          size={40}
        />
        
        <div className="mrow__track" ref={rowRef}>
          {Array.isArray(movies) &&
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
        
        <ChevronRight 
          className="sliderArrow right" 
          onClick={() => handleClick("right")} 
          size={40}
        />
      </div>
    </section>
  );
}