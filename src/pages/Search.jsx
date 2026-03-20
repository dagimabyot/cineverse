/**
 * Search page — searches TMDB by title, supports genre / year / rating filters.
 * Reads ?q= param from URL for direct deep-links from Navbar search.
 */
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { tmdb } from '../components/tmdb';
import MovieGrid from '../components/movies/MovieGrid';

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const [query, setQuery] = useState(params.get('q') || '');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    tmdb.genres().then(data => setGenres(data.genres || []));
  }, []);

  const doSearch = useCallback(async (p = 1) => {
    setLoading(true);
    let data;
    if (query.trim()) {
      data = await tmdb.search(query.trim(), p);
    } else {
      data = await tmdb.discover({
        with_genres: selectedGenre || undefined,
        primary_release_year: year || undefined,
        'vote_average.gte': minRating > 0 ? minRating : undefined,
        sort_by: 'popularity.desc',
        page: p,
      });
    }
    setMovies(p === 1 ? (data.results || []) : prev => [...prev, ...(data.results || [])]);
    setTotalPages(data.total_pages || 1);
    setPage(p);
    setLoading(false);
  }, [query, selectedGenre, year, minRating]);

  useEffect(() => {
    const q = params.get('q');
    if (q) { setQuery(q); }
  }, [location.search]);

  useEffect(() => {
    const id = setTimeout(() => doSearch(1), 400);
    return () => clearTimeout(id);
  }, [query, selectedGenre, year, minRating]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/Search?q=${encodeURIComponent(query)}`);
    doSearch(1);
  };

  const years = Array.from({ length: 35 }, (_, i) => 2024 - i);

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white mb-6">Search Movies</h1>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by movie title..."
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-2xl pl-12 pr-4 py-3.5 text-base focus:outline-none focus:border-violet-500 placeholder-gray-500"
          />
        </form>

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Genre</label>
              <select value={selectedGenre} onChange={e => setSelectedGenre(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500">
                <option value="">All Genres</option>
                {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Year</label>
              <select value={year} onChange={e => setYear(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500">
                <option value="">Any Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Min Rating: {minRating > 0 ? `${minRating}/10` : 'Any'}</label>
              <input type="range" min={0} max={9} step={1} value={minRating}
                onChange={e => setMinRating(Number(e.target.value))}
                className="w-full accent-violet-500" />
            </div>
          </div>
        )}

        {/* Results */}
        <MovieGrid movies={movies} loading={loading} />

        {!loading && movies.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No movies found.</p>
            <p className="text-sm mt-1">Try a different search or adjust the filters.</p>
          </div>
        )}

        {/* Load more */}
        {!loading && page < totalPages && movies.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => doSearch(page + 1)}
              className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-full transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
}