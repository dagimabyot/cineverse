/**
 * ApiKeySetup — shown when no TMDB API key is found in localStorage.
 * Guides user through getting a free TMDB key and entering it.
 */
import { useState } from 'react';
import { Film, ExternalLink, Key, CheckCircle } from 'lucide-react';
import { setApiKey } from './tmdb';

const STEPS = [
  { n: 1, text: 'Go to', link: 'https://www.themoviedb.org/signup', linkText: 'themoviedb.org', rest: 'and create a free account.' },
  { n: 2, text: 'After logging in, click your avatar → Settings → API.' },
  { n: 3, text: 'Under "API Key (v3 auth)", click "Create" and fill in the short form (select "Personal" use).' },
  { n: 4, text: 'Copy your API Read Access Token or the v3 Auth key and paste it below.' },
];

export default function ApiKeySetup({ onSaved }) {
  const [key, setKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [err, setErr] = useState('');

  const save = async () => {
    if (!key.trim()) return;
    setTesting(true); setErr('');
    try {
      const res = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${key.trim()}`);
      if (res.status === 401) { setErr('Invalid API key — please double-check and try again.'); setTesting(false); return; }
      if (!res.ok) { setErr('Could not connect to TMDB. Check your internet connection.'); setTesting(false); return; }
      setApiKey(key.trim());
      onSaved();
    } catch {
      setErr('Network error. Please try again.');
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Cine<span className="text-violet-400">Verse</span></span>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-1">
            <Key className="w-5 h-5 text-violet-400" />
            <h2 className="text-white text-lg font-semibold">Connect to TMDB</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">CineVerse uses The Movie Database (TMDB) for all movie data. Follow these steps to get your free API key:</p>

          <div className="space-y-3 mb-6">
            {STEPS.map(({ n, text, link, linkText, rest }) => (
              <div key={n} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-violet-600/20 border border-violet-600/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-violet-400 text-xs font-bold">{n}</span>
                </div>
                <p className="text-gray-300 text-sm">
                  {text} {link && <a href={link} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline inline-flex items-center gap-0.5">{linkText}<ExternalLink className="w-3 h-3" /></a>} {rest}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <input
              value={key}
              onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && save()}
              placeholder="Paste your TMDB API key here..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 placeholder-gray-500"
            />
            {err && <p className="text-red-400 text-sm">{err}</p>}
            <button
              onClick={save}
              disabled={!key.trim() || testing}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {testing ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying...</>
              ) : (
                <><CheckCircle className="w-4 h-4" /> Save & Launch CineVerse</>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">Your key is stored only in your browser. It is never sent to our servers.</p>
      </div>
    </div>
  );
}