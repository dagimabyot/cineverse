import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Clock, Calendar, Star, ArrowLeft, ImageOff, Heart, Bookmark, Users, Film, Award, Globe, ChevronRight } from 'lucide-react';
import { tmdb, imgUrl } from '../components/tmdb';
import MovieGrid from '../components/movies/MovieGrid';
import RatingStars from '../components/movies/RatingStars';
import TrailerModal from '../components/movies/TrailerModal';
import WatchlistFavButton from '../components/movies/WatchlistFavB';
import ReviewSection from '../components/movies/ReviewSection';
import { base44 } from '@/api/base44Client';

export default function MoviePage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerSearch, setTrailerSearch] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [user, setUser] = useState(null);
  const [imgErr, setImgErr] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    setLoading(true);
    setImgErr(false);
    setActiveTab('overview');
    window.scrollTo(0, 0);
    tmdb.details(id).then(data => {
      setMovie(data);
      const t = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')
        || data.videos?.results?.find(v => v.site === 'YouTube');
      setTrailerKey(t?.key || null);
      setTrailerSearch(`${data.title} ${data.release_date?.slice(0, 4) || ''} official trailer`);
      setLoading(false);
      // Log to watch history only if logged in
      base44.auth.me().then(u => {
        if (!u) return;
        base44.entities.WatchHistory.create({
          movie_id: data.id,
          title: data.title,
          poster_path: data.poster_path,
          release_date: data.release_date,
          vote_average: data.vote_average,
          watched_at: new Date().toISOString(),
        });
      }).catch(() => {});
    });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-800 border-t-violet-500 rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading movie...</p>
      </div>
    </div>
  );
  if (!movie) return (
    <div className="min-h-screen bg-gray-950 pt-24 text-center text-gray-400">
      <Film className="w-16 h-16 mx-auto mb-4 opacity-20" />
      <p>Movie not found.</p>
    </div>
  );

  const backdrop = imgUrl(movie.backdrop_path, 'original');
  const poster = imgUrl(movie.poster_path, 'w500');
  const director = movie.credits?.crew?.find(c => c.job === 'Director');
  const writers = movie.credits?.crew?.filter(c => c.job === 'Writer' || c.job === 'Screenplay').slice(0, 2) || [];
  const cast = movie.credits?.cast?.slice(0, 8) || [];
  const similar = movie.similar?.results?.slice(0, 10) || [];
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  const trailers = movie.videos?.results?.filter(v => v.site === 'YouTube') || [];

  const formatMoney = (n) => n ? '$' + (n >= 1e6 ? (n / 1e6).toFixed(0) + 'M' : n.toLocaleString()) : null;

  const tabs = ['overview', 'cast', 'media', 'reviews'];

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* ── HERO BACKDROP ── */}
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden">
        {backdrop ? (
          <img src={backdrop} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-900" />
        )}
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/95 via-gray-950/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-gray-950/40" />

        {/* Back button */}
        <Link to="/Home"
          className="absolute top-20 left-4 md:left-8 z-10 flex items-center gap-1.5 text-gray-300 hover:text-white text-sm bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 transition-all hover:border-white/30">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-20 right-4 md:right-8 z-10 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-yellow-400/30 rounded-xl px-3 py-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <div>
              <p className="text-white font-bold text-lg leading-none">{rating}</p>
              <p className="text-gray-400 text-xs">{movie.vote_count?.toLocaleString()} votes</p>
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Poster + Title row */}
        <div className="flex flex-col md:flex-row gap-8 -mt-36 md:-mt-48 relative z-10 mb-8">

          {/* Poster */}
          <div className="flex-shrink-0 w-40 md:w-56 lg:w-64 mx-auto md:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] ring-1 ring-white/10 aspect-[2/3] bg-gray-800">
              {poster && !imgErr ? (
                <img src={poster} alt={movie.title} onError={() => setImgErr(true)} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                  <ImageOff className="w-10 h-10" /><span className="text-xs">No Poster</span>
                </div>
              )}
            </div>
          </div>

          {/* Title + meta + actions */}
          <div className="flex-1 pt-0 md:pt-36 lg:pt-44 text-center md:text-left">

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3 justify-center md:justify-start">
              {movie.genres?.map(g => (
                <span key={g.id} className="px-3 py-0.5 rounded-full bg-violet-500/15 text-violet-300 text-xs border border-violet-500/30 font-medium">{g.name}</span>
              ))}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2 tracking-tight">{movie.title}</h1>
            {movie.original_title !== movie.title && (
              <p className="text-gray-500 text-sm mb-2">{movie.original_title}</p>
            )}
            {movie.tagline && (
              <p className="text-violet-400 italic text-base mb-4">"{movie.tagline}"</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-6 justify-center md:justify-start">
              {movie.release_date && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              )}
              {movie.runtime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-500" />
                  {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </span>
              )}
              {movie.status && (
                <span className="flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-gray-500" />
                  {movie.status}
                </span>
              )}
              {movie.original_language && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-gray-500" />
                  {movie.original_language.toUpperCase()}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start items-center">
              {trailerKey ? (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-red-900/40 hover:shadow-red-700/40 hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" /> Watch Trailer
                </button>
              ) : (
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(trailerSearch || movie.title + ' official trailer')}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-red-900/40 hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" /> Watch Trailer
                </a>
              )}

              {user && (
                <div className="flex items-center gap-2">
                  <WatchlistFavButton movie={movie} user={user} type="favorite" />
                  <WatchlistFavButton movie={movie} user={user} type="watchlist" />
                </div>
              )}
            </div>
          </div>
        </div>



        {/* ── TABS ── */}
        <div className="flex gap-1 bg-gray-900/60 p-1 rounded-xl mb-8 border border-gray-800 w-fit">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-2 space-y-8">
              {movie.overview && (
                <div>
                  <h2 className="text-lg font-bold text-white mb-3">Synopsis</h2>
                  <p className="text-gray-300 leading-relaxed text-[15px]">{movie.overview}</p>
                </div>
              )}

              {/* Top cast preview */}
              {cast.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white">Top Cast</h2>
                    <button onClick={() => setActiveTab('cast')} className="text-violet-400 text-xs hover:text-violet-300 flex items-center gap-1">
                      See all <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {cast.slice(0, 4).map(actor => (
                      <div key={actor.id} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex items-center gap-3 hover:border-gray-700 transition-colors">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                          {actor.profile_path ? (
                            <img src={imgUrl(actor.profile_path, 'w185')} alt={actor.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-sm">{actor.name[0]}</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-xs font-semibold line-clamp-1">{actor.name}</p>
                          <p className="text-gray-500 text-xs line-clamp-1">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar info */}
            <div className="space-y-4">
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-semibold mb-4">Movie Info</h3>
                <dl className="space-y-3 text-sm">
                  {director && (
                    <div>
                      <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Director</dt>
                      <dd className="text-white font-medium">{director.name}</dd>
                    </div>
                  )}
                  {writers.length > 0 && (
                    <div>
                      <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Writers</dt>
                      <dd className="text-white">{writers.map(w => w.name).join(', ')}</dd>
                    </div>
                  )}
                  {movie.production_companies?.slice(0, 2).length > 0 && (
                    <div>
                      <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Studio</dt>
                      <dd className="text-white">{movie.production_companies.slice(0, 2).map(c => c.name).join(', ')}</dd>
                    </div>
                  )}
                  {movie.production_countries?.length > 0 && (
                    <div>
                      <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Country</dt>
                      <dd className="text-white">{movie.production_countries.map(c => c.name).join(', ')}</dd>
                    </div>
                  )}
                  {movie.release_date && (
                    <div>
                      <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Release Date</dt>
                      <dd className="text-white">{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</dd>
                    </div>
                  )}
                  {movie.runtime > 0 && (
                    <div>
                      <dt className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Runtime</dt>
                      <dd className="text-white">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: CAST ── */}
        {activeTab === 'cast' && (
          <div className="mb-16">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map(actor => (
                <div key={actor.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-violet-500/40 transition-all group">
                  <div className="aspect-[3/4] bg-gray-800 overflow-hidden">
                    {actor.profile_path ? (
                      <img src={imgUrl(actor.profile_path, 'w342')} alt={actor.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-4xl font-bold">{actor.name[0]}</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-semibold line-clamp-1">{actor.name}</p>
                    <p className="text-violet-400 text-xs line-clamp-1 mt-0.5">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>

            {director && (
              <div className="mt-8">
                <h3 className="text-white font-semibold mb-4">Crew Highlights</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5">
                    <p className="text-gray-500 text-xs">Director</p>
                    <p className="text-white font-medium text-sm">{director.name}</p>
                  </div>
                  {writers.map(w => (
                    <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5">
                      <p className="text-gray-500 text-xs">Writer</p>
                      <p className="text-white font-medium text-sm">{w.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB: MEDIA ── */}
        {activeTab === 'media' && (
          <div className="mb-16">
            {trailers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trailers.slice(0, 4).map(v => (
                  <div key={v.key} className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 group cursor-pointer"
                    onClick={() => { setTrailerKey(v.key); setShowTrailer(true); }}>
                    <img
                      src={`https://img.youtube.com/vi/${v.key}/hqdefault.jpg`}
                      alt={v.name}
                      className="w-full aspect-video object-cover group-hover:opacity-70 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-white text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white text-sm font-medium line-clamp-1">{v.name}</p>
                      <p className="text-gray-400 text-xs capitalize">{v.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-600">
                <Play className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>No videos available.</p>
                {trailerSearch && (
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(trailerSearch)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-red-500 hover:text-red-400 text-sm">
                    <Play className="w-4 h-4" /> Search on YouTube
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: REVIEWS ── */}
        {activeTab === 'reviews' && (
          <div className="mb-16">
            <ReviewSection movieId={Number(id)} movieTitle={movie.title} user={user} />
          </div>
        )}

        {/* Similar Movies */}
        {similar.length > 0 && (
          <div className="pb-16">
            <MovieGrid title="More Like This" movies={similar} />
          </div>
        )}
      </div>

      {showTrailer && trailerKey && <TrailerModal videoKey={trailerKey} onClose={() => setShowTrailer(false)} />}
    </div>
  );
}
