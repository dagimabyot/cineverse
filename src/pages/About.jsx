import { Film, Star, Search, Heart, Bookmark, MessageSquare, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Star, title: 'Real Movie Data', desc: 'Live data from TMDB — posters, ratings, cast, trailers.' },
  { icon: Search, title: 'Powerful Search', desc: 'Search by title or browse by genre, year, and rating.' },
  { icon: Heart, title: 'Favorites', desc: 'Save movies you love to your personal favorites list.' },
  { icon: Bookmark, title: 'Watchlist', desc: 'Queue up movies you want to watch later.' },
  { icon: MessageSquare, title: 'Reviews', desc: 'Rate and review any movie. See what others think.' },
  { icon: Film, title: 'Trailers', desc: 'Watch official YouTube trailers right inside the app.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 flex items-center justify-center">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">Cine<span className="text-violet-400">Verse</span></h1>
          </div>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            A modern movie discovery platform built with React, powered by TMDB API. Discover, track, and review films you love.
          </p>
          <Link to="/Home" className="inline-block mt-6 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-full transition-colors">
            Start Exploring →
          </Link>
        </div>

        {/* Features */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-16">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-violet-500/50 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-violet-600/20 flex items-center justify-center mb-3">
                <Icon className="w-4.5 h-4.5 text-violet-400" />
              </div>
              <h3 className="text-white font-semibold mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {['React 18', 'React Router v6', 'Tailwind CSS', 'TMDB API', 'Base44 Auth', 'Base44 Database', 'Lucide Icons', 'Framer Motion'].map(t => (
              <span key={t} className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full border border-gray-700">{t}</span>
            ))}
          </div>
        </div>

        {/* TMDB Attribution */}
        <div className="text-center text-gray-600 text-sm">
          <p>Movie data provided by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline inline-flex items-center gap-1">The Movie Database (TMDB) <ExternalLink className="w-3 h-3" /></a>.</p>
          <p className="mt-1">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
        </div>
      </div>
    </div>
  );
}