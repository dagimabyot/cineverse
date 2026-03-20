/**
 * MovieGrid — responsive grid of MovieCards with section heading and optional "See More".
 */
import MovieCard from './MovieCard';

export default function MovieGrid({ title, movies = [], loading = false, cols = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' }) {
  if (loading) {
    return (
      <section className="mb-12">
        {title && <h2 className="text-xl font-bold text-white mb-4">{title}</h2>}
        <div className={`grid ${cols} gap-4`}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }
  if (!movies.length) return null;
  return (
    <section className="mb-12">
      {title && <h2 className="text-xl font-bold text-white mb-4">{title}</h2>}
      <div className={`grid ${cols} gap-4`}>
        {movies.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
    </section>
  );
}