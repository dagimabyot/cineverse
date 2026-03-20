import { Shield, CheckCircle, XCircle, Film, Users, Globe, AlertTriangle } from 'lucide-react';

const ALLOWED = [
  'Animation', 'Adventure', 'Comedy', 'Documentary',
  'Fantasy', 'History', 'Science Fiction', 'Family',
  'Action', 'Drama (non-explicit)', 'Mystery', 'Music',
];

const BLOCKED = [
  'Adult / Erotic content', 'Nudity or partial nudity',
  'Sexual scenes or romantic intimacy', 'Suggestive or explicit imagery',
  'R-rated & NC-17 content', 'Explicit language or mature references',
];

export default function ContentPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-violet-400" />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">Content Safety Policy</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            CineVerse is a clean, family-friendly movie platform designed for educational and general audiences of all ages.
          </p>
        </div>

        {/* Our Commitment */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-violet-400" /> Our Commitment
          </h2>
          <p className="text-gray-400 leading-relaxed text-sm">
            CineVerse is built with families, students, and general audiences in mind. We are committed to providing a safe browsing experience by filtering out inappropriate content at every level — from search results and recommendations to posters, backdrops, and trailers.
          </p>
        </div>

        {/* What we allow */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" /> Allowed Content
          </h2>
          <p className="text-gray-400 text-sm mb-4">We prioritize movies rated G, PG, and PG-13 (and international equivalents) across these family-friendly genres:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ALLOWED.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-300 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0" /> {item}
              </div>
            ))}
          </div>
        </div>

        {/* What we block */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" /> Blocked Content
          </h2>
          <p className="text-gray-400 text-sm mb-4">The following content types are automatically excluded from all pages, search results, and recommendations:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {BLOCKED.map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" /> {item}
              </div>
            ))}
          </div>
        </div>

        {/* Technical measures */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" /> Technical Safeguards
          </h2>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              'All TMDB API requests include include_adult=false',
              'Romance (ID 10749) and Adult (ID 10768) genres are excluded from all requests via without_genres',
              'Search results are filtered server-side before display',
              'Movie detail pages skip adult-flagged content',
              'Similar/recommended movies apply the same content filters',
              'Missing or unsafe posters are replaced with neutral placeholders',
              'Trailers link only to official YouTube content',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* TMDB Attribution */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-400" /> Data Attribution
          </h2>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                This product uses the TMDB API but is not endorsed or certified by TMDB. Movie data, posters, and metadata are provided by The Movie Database (TMDB) under their terms of use.
              </p>
              <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors">
                <Film className="w-4 h-4" /> themoviedb.org →
              </a>
            </div>
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB Logo"
              className="h-8 opacity-70"
            />
          </div>
        </div>

        <p className="text-center text-gray-700 text-xs mt-8">Last updated: March 2026 · CineVerse Content Safety Team</p>
      </div>
    </div>
  );
}