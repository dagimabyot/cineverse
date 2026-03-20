/**
 * Home page — Hero carousel + Popular, Top Rated, Upcoming sections.
 * Fetches all data from TMDB on mount.
 */
import { useState, useEffect } from 'react';
import HeroCarousel from '../components/movies/HeroCarousel';
import MovieGrid from '../components/movies/MovieGrid';
import { tmdb } from '../components/tmdb';

const BANNER_TITLES = [
  "Spider-Man: No Way Home",
  "War Machine",
  "Zootopia 2",
  "Hoppers",
  "Avengers: Infinity War",
  "Avatar",
  "Dune: Part Two",
  "Black Panther",
  "Kung Fu Panda 4",
  "Harry Potter and the Philosopher's Stone",
];

const withPoster = (movies) => movies.filter(m => m.poster_path && m.backdrop_path);

export default function Home() {
  const [bannerMovies, setBannerMovies] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [bannerResults, p, tr, u] = await Promise.all([
        Promise.all(BANNER_TITLES.map(title => tmdb.search(title, 1).then(r => r.results?.[0]).catch(() => null))),
        tmdb.popular(),
        tmdb.topRated(),
        tmdb.upcoming(),
      ]);
      setBannerMovies(bannerResults.filter(m => m && m.backdrop_path));
      setPopular(withPoster(p.results || []));
      setTopRated(withPoster(tr.results || []));
      setUpcoming(withPoster(u.results || []));
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950">
      <HeroCarousel movies={bannerMovies} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <MovieGrid title="⭐ Popular Now" movies={popular} loading={loading} />
        <MovieGrid title="🏆 Top Rated" movies={topRated} loading={loading} />
        <MovieGrid title="🎬 Upcoming Releases" movies={upcoming} loading={loading} />
      </div>
    </div>
  );
}