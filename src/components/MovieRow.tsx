import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";
import "./movierow.css";

type Movie = {
  id: string;
  title: string;
  thumb: string;
  match: number;
  year: number;
  rating: string;
  genres: string[];
  tag?: string;
};

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export default function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scroll = (dir: "left" | "right") => {
    const el = rowRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.75;

    el.scrollBy({
      left: dir === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="mrow">
      <div className="mrow__header">
        <h2 className="mrow__title">{title}</h2>
        <button className="mrow__see-all">
          Explore All <ChevronRight size={14} />
        </button>
      </div>

      <div className="mrow__track-wrap">
        {/* Left arrow */}
        <button
          className="mrow__arrow mrow__arrow--left"
          onClick={() => scroll("left")}
        >
          <ChevronLeft size={24} />
        </button>

        {/* Scrollable row */}
        <div className="mrow__track" ref={rowRef}>
          {Array.isArray(movies) &&
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>

        {/* Right arrow */}
        <button
          className="mrow__arrow mrow__arrow--right"
          onClick={() => scroll("right")}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}