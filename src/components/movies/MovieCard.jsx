/**
 * MovieCard — displays a movie poster, title, year, and rating.
 * Used in grids, carousels, and search results.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ImageOff } from 'lucide-react';
import { imgUrl } from '../tmdb';

export default function MovieCard({ movie, className = '' }) {
  const [imgErr, setImgErr] = useState(false);
  const poster = imgUrl(movie.poster_path, 'w500');
  const year = movie.release_date?.slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);

  return (
    <Link to={`/Movie/${movie.id}`} className={`group relative flex flex-col bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-violet-500/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${className}`}>
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gray-800 overflow-hidden">
        {poster && !imgErr ? (
          <img
            src={poster}
            alt={movie.title}
            onError={() => setImgErr(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs">No Poster</span>
          </div>
        )}
        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-white font-medium">{rating}</span>
          </div>
        )}
        {/* Hover overlay with synopsis */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
          {movie.overview && (
            <p className="text-white text-xs leading-relaxed line-clamp-4">{movie.overview}</p>
          )}
        </div>
      </div>
      {/* Info */}
      <div className="p-3">
        <h3 className="text-white text-sm font-semibold line-clamp-1 group-hover:text-violet-300 transition-colors">{movie.title}</h3>
        {year && <p className="text-gray-500 text-xs mt-0.5">{year}</p>}
      </div>
    </Link>
  );
}