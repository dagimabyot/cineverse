import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Star, Heart, Bookmark, MessageSquare, LogOut, Clock, Film, TrendingUp, Edit2, Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import RatingStars from '../components/movies/RatingStars';
import { imgUrl } from '../components/tmdb';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    base44.auth.me().then(async u => {
      setUser(u);
      setNewName(u.full_name || '');
      const [revs, favs, wl, hist] = await Promise.all([
        base44.entities.Review.filter({ created_by: u.email }, '-created_date', 50),
        base44.entities.Favorite.filter({ created_by: u.email }, '-created_date', 50),
        base44.entities.Watchlist.filter({ created_by: u.email }, '-created_date', 50),
        base44.entities.WatchHistory.filter({ created_by: u.email }, '-watched_at', 30),
      ]);
      setReviews(revs);
      setFavorites(favs);
      setWatchlist(wl);
      // Deduplicate history by movie_id, keep latest
      const seen = new Set();
      setHistory(hist.filter(h => { if (seen.has(h.movie_id)) return false; seen.add(h.movie_id); return true; }));
      setLoading(false);
    }).catch(() => { base44.auth.redirectToLogin(); });
  }, []);

  const saveName = async () => {
    if (!newName.trim()) return;
    setSavingName(true);
    await base44.auth.updateMe({ full_name: newName.trim() });
    setUser(u => ({ ...u, full_name: newName.trim() }));
    setSavingName(false);
    setEditingName(false);
  };

  const removeReview = async (rev) => {
    await base44.entities.Review.delete(rev.id);
    setReviews(prev => prev.filter(r => r.id !== rev.id));
  };

  const removeFav = async (fav) => {
    await base44.entities.Favorite.delete(fav.id);
    setFavorites(prev => prev.filter(f => f.id !== fav.id));
  };

  const removeWl = async (item) => {
    await base44.entities.Watchlist.delete(item.id);
    setWatchlist(prev => prev.filter(w => w.id !== item.id));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gray-800 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;
  const tabs = ['overview', 'favorites', 'watchlist', 'history', 'reviews'];

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-16 text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Profile Header ── */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg flex-shrink-0">
            {user?.full_name?.[0]?.toUpperCase() || <User className="w-9 h-9" />}
          </div>
          <div className="flex-1 text-center sm:text-left">
            {editingName ? (
              <div className="flex items-center gap-2 mb-1">
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false); }}
                  className="bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-1.5 text-lg font-bold focus:outline-none focus:border-violet-500"
                  autoFocus
                />
                <button onClick={saveName} disabled={savingName} className="p-1.5 text-green-400 hover:text-green-300"><Check className="w-4 h-4" /></button>
                <button onClick={() => setEditingName(false)} className="p-1.5 text-gray-500 hover:text-gray-300"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                <h1 className="text-2xl font-bold text-white">{user?.full_name || 'Anonymous'}</h1>
                <button onClick={() => setEditingName(true)} className="text-gray-600 hover:text-gray-400 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
              </div>
            )}
            <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start text-xs text-gray-500">
              <span className="flex items-center gap-1"><Film className="w-3 h-3" /> Member since {new Date(user?.created_date || Date.now()).getFullYear()}</span>
              {avgRating && <span className="flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3 fill-yellow-400" /> Avg rating: {avgRating}/5</span>}
            </div>
          </div>
          <button onClick={() => base44.auth.logout()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-950/30">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Heart, color: 'text-red-400', count: favorites.length, label: 'Favorites' },
            { icon: Bookmark, color: 'text-violet-400', count: watchlist.length, label: 'Watchlist' },
            { icon: MessageSquare, color: 'text-blue-400', count: reviews.length, label: 'Reviews' },
            { icon: Clock, color: 'text-green-400', count: history.length, label: 'Watched' },
          ].map(({ icon: Icon, color, count, label }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 text-center hover:border-gray-700 transition-colors">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-gray-500 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 bg-gray-900/60 p-1 rounded-xl mb-6 border border-gray-800 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all flex-1 ${activeTab === tab ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent History */}
            {history.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-400" /> Recently Watched</h2>
                  <button onClick={() => setActiveTab('history')} className="text-xs text-violet-400 hover:text-violet-300">See all</button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {history.slice(0, 8).map(h => (
                    <Link key={h.id} to={`/Movie/${h.movie_id}`} className="flex-shrink-0 w-24 group">
                      <div className="rounded-xl overflow-hidden bg-gray-800 aspect-[2/3] mb-1.5">
                        {h.poster_path ? (
                          <img src={imgUrl(h.poster_path, 'w185')} alt={h.title} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600"><Film className="w-6 h-6" /></div>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs line-clamp-1 group-hover:text-white transition-colors">{h.title}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Reviews */}
            {reviews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Recent Reviews</h2>
                  <button onClick={() => setActiveTab('reviews')} className="text-xs text-violet-400 hover:text-violet-300">See all</button>
                </div>
                <div className="space-y-2">
                  {reviews.slice(0, 3).map(r => (
                    <Link key={r.id} to={`/Movie/${r.movie_id}`} className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl p-3 hover:border-gray-700 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium line-clamp-1">{r.movie_title || `Movie #${r.movie_id}`}</p>
                        {r.review_text && <p className="text-gray-500 text-xs line-clamp-1">{r.review_text}</p>}
                      </div>
                      <RatingStars value={r.rating} size="sm" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {favorites.length === 0 && watchlist.length === 0 && reviews.length === 0 && history.length === 0 && (
              <div className="text-center py-16 text-gray-600">
                <Film className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">Nothing here yet</p>
                <p className="text-sm mt-1">Start browsing movies to build your profile.</p>
                <Link to="/Home" className="mt-4 inline-block px-5 py-2 bg-violet-600 text-white rounded-full text-sm hover:bg-violet-500 transition-colors">Browse Movies</Link>
              </div>
            )}
          </div>
        )}

        {/* ── Favorites Tab ── */}
        {activeTab === 'favorites' && (
          <div>
            {favorites.length === 0 ? (
              <EmptyState icon={Heart} message="No favorites yet." sub="Heart a movie on its detail page." />
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {favorites.map(fav => (
                  <div key={fav.id} className="relative group">
                    <Link to={`/Movie/${fav.movie_id}`}>
                      <div className="rounded-xl overflow-hidden bg-gray-800 aspect-[2/3]">
                        {fav.poster_path ? (
                          <img src={imgUrl(fav.poster_path, 'w185')} alt={fav.title} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600"><Film className="w-8 h-8" /></div>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-1.5 line-clamp-1 group-hover:text-white transition-colors">{fav.title}</p>
                    </Link>
                    <button onClick={() => removeFav(fav)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Watchlist Tab ── */}
        {activeTab === 'watchlist' && (
          <div>
            {watchlist.length === 0 ? (
              <EmptyState icon={Bookmark} message="Your watchlist is empty." sub="Bookmark movies to watch later." />
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {watchlist.map(item => (
                  <div key={item.id} className="relative group">
                    <Link to={`/Movie/${item.movie_id}`}>
                      <div className="rounded-xl overflow-hidden bg-gray-800 aspect-[2/3]">
                        {item.poster_path ? (
                          <img src={imgUrl(item.poster_path, 'w185')} alt={item.title} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600"><Film className="w-8 h-8" /></div>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-1.5 line-clamp-1 group-hover:text-white transition-colors">{item.title}</p>
                    </Link>
                    <button onClick={() => removeWl(item)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-violet-600 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── History Tab ── */}
        {activeTab === 'history' && (
          <div>
            {history.length === 0 ? (
              <EmptyState icon={Clock} message="No watch history yet." sub="Movies you visit will appear here." />
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {history.map(h => (
                  <Link key={h.id} to={`/Movie/${h.movie_id}`} className="group">
                    <div className="rounded-xl overflow-hidden bg-gray-800 aspect-[2/3]">
                      {h.poster_path ? (
                        <img src={imgUrl(h.poster_path, 'w185')} alt={h.title} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600"><Film className="w-8 h-8" /></div>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs mt-1.5 line-clamp-1 group-hover:text-white transition-colors">{h.title}</p>
                    <p className="text-gray-600 text-xs">{new Date(h.watched_at || h.created_date).toLocaleDateString()}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Reviews Tab ── */}
        {activeTab === 'reviews' && (
          <div>
            {reviews.length === 0 ? (
              <EmptyState icon={MessageSquare} message="No reviews yet." sub="Rate and review movies you've watched." />
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-start gap-4 group hover:border-gray-700 transition-colors">
                    <Link to={`/Movie/${r.movie_id}`} className="flex-shrink-0">
                      <div className="w-12 h-16 rounded-lg bg-gray-800 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs text-center p-1">{r.movie_title?.slice(0, 10)}</div>
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/Movie/${r.movie_id}`} className="text-white font-semibold text-sm hover:text-violet-400 transition-colors line-clamp-1">
                        {r.movie_title || `Movie #${r.movie_id}`}
                      </Link>
                      <div className="flex items-center gap-2 my-1">
                        <RatingStars value={r.rating} size="sm" />
                        <span className="text-gray-500 text-xs">{new Date(r.created_date).toLocaleDateString()}</span>
                      </div>
                      {r.review_text && <p className="text-gray-400 text-sm leading-relaxed">{r.review_text}</p>}
                    </div>
                    <button onClick={() => removeReview(r)} className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div className="text-center py-20 text-gray-600">
      <Icon className="w-14 h-14 mx-auto mb-4 opacity-20" />
      <p className="text-base font-medium text-gray-500">{message}</p>
      <p className="text-sm mt-1">{sub}</p>
    </div>
  );
}