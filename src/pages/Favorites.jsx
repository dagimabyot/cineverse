/**
 * Favorites page — shows all movies the logged-in user has favorited.
 * Supports sort by rating, title, year and remove functionality.
 */
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import MovieCard from '../components/movies/MovieCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('added');
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      base44.entities.Favorite.filter({ created_by: u.email }).then(data => {
        setFavorites(data);
        setLoading(false);
      });
    }).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  const remove = async (fav) => {
    await base44.entities.Favorite.delete(fav.id);
    setFavorites(prev => prev.filter(f => f.id !== fav.id));
  };

  const sorted = [...favorites].sort((a, b) => {
    if (sort === 'rating') return (b.vote_average || 0) - (a.vote_average || 0);
    if (sort === 'title') return a.title.localeCompare(b.title);
    if (sort === 'year') return (b.release_date || '').localeCompare(a.release_date || '');
    return new Date(b.created_date) - new Date(a.created_date);
  });

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
            {!loading && <span className="text-gray-500 text-base">({favorites.length})</span>}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none">
            <option value="added">Recently Added</option>
            <option value="rating">Highest Rated</option>
            <option value="title">A–Z</option>
            <option value="year">Newest First</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <div key={i} className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Heart className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="text-lg">No favorites yet.</p>
            <p className="text-sm mt-1">Browse movies and click the heart icon to save them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {sorted.map(fav => (
              <div key={fav.id} className="relative group">
                <MovieCard movie={{ id: fav.movie_id, title: fav.title, poster_path: fav.poster_path, release_date: fav.release_date, vote_average: fav.vote_average }} />
                <button
                  onClick={() => remove(fav)}
                  className="absolute top-2 left-2 w-7 h-7 bg-black/60 hover:bg-red-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove from favorites"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}