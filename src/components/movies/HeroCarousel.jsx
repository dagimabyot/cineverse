/**
 * HeroCarousel — full-width backdrop carousel for featured/trending movies.
 * Autoplay every 6s with manual prev/next navigation.
 */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, Play } from 'lucide-react';
import { imgUrl } from '../tmdb';

export default function HeroCarousel({ movies = [] }) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  const go = useCallback((next) => {
    setFading(true);
    setTimeout(() => {
      setIdx(next);
      setFading(false);
    }, 300);
  }, []);

  const prev = () => go((idx - 1 + movies.length) % movies.length);
  const next = useCallback(() => go((idx + 1) % movies.length), [idx, movies.length, go]);

  useEffect(() => {
    if (!movies.length) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next, movies.length]);

  if (!movies.length) return <div className="w-full h-[70vh] bg-gray-900 animate-pulse" />;

  const movie = movies[idx];
  const backdrop = imgUrl(movie.backdrop_path, 'original');

  return (
    <div className="relative w-full overflow-hidden bg-gray-950" style={{ height: '100svh', maxHeight: '780px', minHeight: '520px' }}>
      {/* Backdrop image */}
      <img
        src={backdrop}
        alt={movie.title}
        className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}
      />

      {/* Cinematic gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/60 to-gray-950/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
      {/* Strong top gradient to hide image behind navbar */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-950 via-gray-950/80 to-transparent" />

      {/* Content */}
      <div className={`absolute inset-0 flex flex-col justify-end px-6 pb-20 md:px-16 md:pb-24 max-w-3xl transition-opacity duration-300 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          {movie.vote_average > 0 && (
            <span className="flex items-center gap-1 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 text-yellow-400 text-xs font-semibold px-2.5 py-1 rounded-full">
              <Star className="w-3 h-3 fill-yellow-400" />{movie.vote_average?.toFixed(1)}
            </span>
          )}
          {movie.release_date && (
            <span className="bg-white/10 backdrop-blur-sm border border-white/15 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">{movie.release_date.slice(0, 4)}</span>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-3 leading-tight tracking-tight drop-shadow-2xl">{movie.title}</h1>

        {movie.overview && (
          <p className="text-gray-300 text-sm md:text-base line-clamp-2 mb-6 max-w-xl leading-relaxed">{movie.overview}</p>
        )}

        <div className="flex items-center gap-3">
          <Link
            to={`/Movie/${movie.id}`}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 shadow-lg shadow-violet-900/40"
          >
            <Play className="w-4 h-4 fill-white" /> View Movie
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-violet-600/70 transition-all hover:scale-110">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-violet-600/70 transition-all hover:scale-110">
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
        {movies.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className={`rounded-full transition-all duration-300 ${i === idx ? 'w-6 h-2 bg-violet-400' : 'w-2 h-2 bg-white/30 hover:bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}