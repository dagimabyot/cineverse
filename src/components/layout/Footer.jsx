import { Clapperboard, Github, Linkedin, Send, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="https://media.base44.com/images/public/69b69462a8475aff38f40bef/00f3b02fc_logo-fotor-bg-remover-20260318124331.png" alt="CineVerse" className="w-8 h-8 object-contain" />
              <span className="text-lg font-bold text-white">Cine<span className="text-violet-400">Verse</span></span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">Your ultimate destination for discovering movies, tracking favorites, and exploring cinema.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Navigate</h4>
            <div className="flex flex-col gap-2">
              {[['Home', '/Home'], ['Discover', '/Search'], ['Favorites', '/Favorites'], ['Watchlist', '/Watchlist'], ['Profile', '/Profile'], ['Content Policy', '/ContentPolicy'], ['Documentation', '/Readme']].map(([label, to]) => (
                <Link key={to} to={to} className="text-gray-500 hover:text-violet-400 text-sm transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Follow Us</h4>
            <div className="flex gap-3 mb-4">
              <a href="https://github.com/dagimabyot/cineverse" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-gray-700 transition-colors"><Github className="w-4 h-4" /></a>
              <a href="https://www.linkedin.com/feed/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-gray-700 transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="https://t.me/dagiabyot" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:bg-gray-700 transition-colors"><Send className="w-4 h-4" /></a>
            </div>
            <p className="text-gray-600 text-xs">© {new Date().getFullYear()} CineVerse. All rights reserved.</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-600 text-xs">
        <span>© {new Date().getFullYear()} CineVerse — Discover, track, and enjoy cinema.</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-green-600"><Shield className="w-3 h-3" /> Family-Safe Content</span>
          <span>Powered by CineVerse</span>
          <Link to="/Readme" className="hover:text-gray-400 transition-colors">Docs</Link>
        </div>
        </div>
      </div>
    </footer>
  );
}
