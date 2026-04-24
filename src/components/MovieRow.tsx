import { useRef } from "react";
import MovieCard from "./MovieCard";
import "./movierow.css";

import type { Movie } from "../services/movieService";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="mrow">
      <div className="mrow__header">
        <h2 className="mrow__title">{title}</h2>
        <button className="mrow__see-all" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          Explore All
        </button>
      </div>

      <div className="mrow__track-wrap">
        {/* Scrollable row */}
        <div className="mrow__track" ref={rowRef}>
          {Array.isArray(movies) &&
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
      </div>
    </section>
  );
}