import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Heart, Bookmark, User, Menu, X, LogOut, Clapperboard } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Navbar({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/Search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { to: '/Home', label: 'Home' },
    { to: '/Search', label: 'Discover' },
    ...(user ? [
      { to: '/Favorites', label: 'Favorites', icon: Heart },
      { to: '/Watchlist', label: 'Watchlist', icon: Bookmark },
      { to: '/Profile', label: 'Profile', icon: User },
    ] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-md border-b border-gray-800/60 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">

          {/* Logo */}
          <Link to="/Home" className="flex items-center gap-2 group flex-shrink-0">
            <img src="https://media.base44.com/images/public/69b69462a8475aff38f40bef/00f3b02fc_logo-fotor-bg-remover-20260318124331.png" alt="CineVerse" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold text-white tracking-wide hidden sm:block">Cine<span className="text-violet-400">Verse</span></span>
          </Link>

          {/* Center Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden md:flex relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search movies, genres, actors..."
                className="w-full bg-gray-800/90 border border-gray-700 text-white text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-violet-500 focus:bg-gray-800 placeholder-gray-500 transition-all"
              />
            </div>
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-5 flex-shrink-0">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${location.pathname === to ? 'text-violet-400' : 'text-gray-300 hover:text-white'}`}>
                {label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            {user ? (
              <button onClick={() => base44.auth.logout()} title="Sign Out"
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-1.5 rounded-full hover:bg-gray-800">
                <LogOut className="w-4 h-4" />
                <span className="text-xs">Sign Out</span>
              </button>
            ) : (
              <button onClick={() => base44.auth.redirectToLogin()}
                className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm rounded-full font-medium transition-colors">
                Sign In
              </button>
            )}
          </div>

          {/* Mobile: Search Icon + Hamburger */}
          <div className="md:hidden flex items-center gap-2 ml-auto">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1.5 text-gray-400 hover:text-white">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 text-gray-300 hover:text-white">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="md:hidden pb-3 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-full pl-10 pr-4 py-2 focus:outline-none focus:border-violet-500"
            />
          </form>
        )}
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/98 backdrop-blur-md border-t border-gray-800 px-4 pb-5 pt-3">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className={`block py-2.5 text-sm font-medium border-b border-gray-800/50 ${location.pathname === to ? 'text-violet-400' : 'text-gray-300'}`}>
              {label}
            </Link>
          ))}
          <div className="mt-3">
            {user ? (
              <button onClick={() => base44.auth.logout()} className="w-full py-2 text-sm text-red-400 border border-red-900/40 rounded-lg">
                Sign Out
              </button>
            ) : (
              <button onClick={() => base44.auth.redirectToLogin()}
                className="w-full py-2 bg-violet-600 text-white text-sm rounded-lg font-medium">
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}