/**
 * WatchlistFavButton — toggles movie in Favorites or Watchlist.
 * Requires user to be logged in (handled externally).
 */
import { useState, useEffect } from 'react';
import { Heart, Bookmark } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function WatchlistFavButton({ movie, user, type = 'favorite' }) {
  const [active, setActive] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [loading, setLoading] = useState(false);

  const Entity = type === 'favorite' ? base44.entities.Favorite : base44.entities.Watchlist;

  useEffect(() => {
    if (!user) return;
    Entity.filter({ movie_id: movie.id, created_by: user.email }).then(records => {
      if (records.length > 0) { setActive(true); setRecordId(records[0].id); }
    });
  }, [user, movie.id]);

  const toggle = async () => {
    if (!user) { base44.auth.redirectToLogin(); return; }
    setLoading(true);
    if (active) {
      await Entity.delete(recordId);
      setActive(false); setRecordId(null);
    } else {
      const rec = await Entity.create({
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        genre_ids: movie.genre_ids || [],
      });
      setActive(true); setRecordId(rec.id);
    }
    setLoading(false);
  };

  const Icon = type === 'favorite' ? Heart : Bookmark;
  const activeColor = type === 'favorite' ? 'text-red-500 fill-red-500' : 'text-violet-400 fill-violet-400';

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={type === 'favorite' ? 'Add to Favorites' : 'Add to Watchlist'}
      className={`p-2 rounded-full transition-all ${active ? activeColor : 'text-gray-400 hover:text-white'} hover:bg-white/10 ${loading ? 'opacity-50' : ''}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}