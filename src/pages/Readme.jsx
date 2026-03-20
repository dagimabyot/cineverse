import { Link } from 'react-router-dom';
import { BookOpen, Download, Key, Settings, Play, Heart, Bookmark, Star, Search, Globe, Shield, Film, ChevronRight, Terminal, Package, Zap } from 'lucide-react';

const Section = ({ id, icon: Icon, title, children }) => (
  <section id={id} className="mb-14">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-violet-400" />
      </div>
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    {children}
  </section>
);

const CodeBlock = ({ children }) => (
  <pre className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-sm text-green-400 overflow-x-auto font-mono leading-relaxed mb-4">
    <code>{children}</code>
  </pre>
);

const Step = ({ num, title, children }) => (
  <div className="flex gap-4 mb-6">
    <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">{num}</div>
    <div>
      <h4 className="text-white font-semibold mb-2">{title}</h4>
      {children}
    </div>
  </div>
);

const Feature = ({ icon: Icon, title, desc }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-violet-500/40 transition-colors">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4 text-violet-400" />
      <span className="text-white font-semibold text-sm">{title}</span>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default function ReadmePage() {
  const toc = [
    { id: 'overview', label: 'Overview' },
    { id: 'features', label: 'Features' },
    { id: 'requirements', label: 'Requirements' },
    { id: 'installation', label: 'Installation' },
    { id: 'configuration', label: 'Configuration' },
    { id: 'usage', label: 'Usage Guide' },
    { id: 'tech', label: 'Tech Stack' },
    { id: 'content-policy', label: 'Content Policy' },
    { id: 'credits', label: 'Credits' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="https://media.base44.com/images/public/69b69462a8475aff38f40bef/00f3b02fc_logo-fotor-bg-remover-20260318124331.png"
              alt="CineVerse"
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-5xl font-black text-white">Cine<span className="text-violet-400">Verse</span></h1>
          </div>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">A beautiful, family-safe movie discovery platform powered by TMDB.</p>
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            <span className="px-3 py-1 bg-violet-500/15 border border-violet-500/30 text-violet-300 rounded-full text-xs font-medium">React 18</span>
            <span className="px-3 py-1 bg-blue-500/15 border border-blue-500/30 text-blue-300 rounded-full text-xs font-medium">Vite</span>
            <span className="px-3 py-1 bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 rounded-full text-xs font-medium">Tailwind CSS</span>
            <span className="px-3 py-1 bg-green-500/15 border border-green-500/30 text-green-300 rounded-full text-xs font-medium">TMDB API</span>
            <span className="px-3 py-1 bg-yellow-500/15 border border-yellow-500/30 text-yellow-300 rounded-full text-xs font-medium">Family-Safe</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Sidebar TOC */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-24 bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-3 font-semibold">Contents</p>
              <nav className="space-y-1">
                {toc.map(({ id, label }) => (
                  <a key={id} href={`#${id}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-violet-400 text-sm py-1.5 px-2 rounded-lg hover:bg-violet-500/10 transition-colors group">
                    <ChevronRight className="w-3 h-3 group-hover:text-violet-400 text-gray-600" />
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">

            {/* Overview */}
            <Section id="overview" icon={BookOpen} title="Overview">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-4">
                <p className="text-gray-300 leading-relaxed text-[15px]">
                  <strong className="text-white">CineVerse</strong> is a full-featured, family-friendly movie discovery web application. 
                  It allows users to search and explore thousands of movies, manage personal Favorites and Watchlists, 
                  write reviews, and watch trailers — all within a clean, modern dark-mode interface.
                </p>
                <p className="text-gray-300 leading-relaxed text-[15px] mt-3">
                  All movie data is fetched in real-time from <strong className="text-white">The Movie Database (TMDB)</strong>. 
                  Content filtering is enforced at the API level to ensure the platform stays family-safe by default.
                </p>
              </div>
            </Section>

            {/* Features */}
            <Section id="features" icon={Zap} title="Features">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Feature icon={Search} title="Movie Discovery" desc="Search thousands of movies by title, genre, release year, and rating using the TMDB API." />
                <Feature icon={Play} title="Trailer Playback" desc="Watch official trailers embedded directly in the app via YouTube IFrame API." />
                <Feature icon={Heart} title="Favorites" desc="Save your favorite movies to a personal list — synced to your account." />
                <Feature icon={Bookmark} title="Watchlist" desc="Add movies to your Watchlist to keep track of what you want to watch next." />
                <Feature icon={Star} title="Reviews & Ratings" desc="Write reviews and give star ratings for any movie in the database." />
                <Feature icon={Film} title="Watch History" desc="Automatically tracks movies you've visited so you never lose your place." />
                <Feature icon={Shield} title="Family-Safe Filtering" desc="Adult and romance content is blocked at the API level and in all search results." />
                <Feature icon={Globe} title="Responsive Design" desc="Fully responsive layout that works beautifully on mobile, tablet, and desktop." />
              </div>
            </Section>

            {/* Requirements */}
            <Section id="requirements" icon={Package} title="Requirements">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  {[
                    ['Node.js', 'v18 or higher'],
                    ['npm', 'v9 or higher (comes with Node.js)'],
                    ['TMDB API Key', 'Free account at themoviedb.org'],
                    ['Modern Browser', 'Chrome, Firefox, Edge, Safari'],
                  ].map(([name, note]) => (
                    <li key={name} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                      <span className="text-white font-medium w-36">{name}</span>
                      <span className="text-gray-400">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Section>

            {/* Installation */}
            <Section id="installation" icon={Download} title="Installation">
              <Step num="1" title="Clone the Repository">
                <p className="text-gray-400 text-sm mb-2">Clone the project to your local machine using Git:</p>
                <CodeBlock>{`git clone https://github.com/your-username/cineverse.git
cd cineverse`}</CodeBlock>
              </Step>

              <Step num="2" title="Install Dependencies">
                <p className="text-gray-400 text-sm mb-2">Install all required npm packages:</p>
                <CodeBlock>{`npm install`}</CodeBlock>
              </Step>

              <Step num="3" title="Get a TMDB API Key">
                <p className="text-gray-400 text-sm mb-2">CineVerse uses the TMDB API for all movie data. To get your free API key:</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-400 text-sm mb-3 ml-2">
                  <li>Go to <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">themoviedb.org</a> and create a free account</li>
                  <li>Navigate to <strong className="text-white">Settings → API</strong></li>
                  <li>Request an API key (select "Developer" for personal use)</li>
                  <li>Copy the <strong className="text-white">API Key (v3 auth)</strong> value</li>
                </ol>
              </Step>

              <Step num="4" title="Configure Environment Variables">
                <p className="text-gray-400 text-sm mb-2">Create a <code className="text-violet-300 bg-gray-800 px-1.5 py-0.5 rounded">.env</code> file in the project root:</p>
                <CodeBlock>{`VITE_TMDB_API_KEY=your_api_key_here`}</CodeBlock>
                <p className="text-gray-500 text-xs">The API key is already pre-configured in the app — this step is only needed if you fork the project.</p>
              </Step>

              <Step num="5" title="Start the Development Server">
                <p className="text-gray-400 text-sm mb-2">Run the app locally:</p>
                <CodeBlock>{`npm run dev`}</CodeBlock>
                <p className="text-gray-400 text-sm">The app will be available at <code className="text-violet-300 bg-gray-800 px-1.5 py-0.5 rounded">http://localhost:5173</code></p>
              </Step>

              <Step num="6" title="Build for Production">
                <p className="text-gray-400 text-sm mb-2">To create a production build:</p>
                <CodeBlock>{`npm run build
npm run preview   # preview the production build locally`}</CodeBlock>
              </Step>
            </Section>

            {/* Configuration */}
            <Section id="configuration" icon={Settings} title="Configuration">
              <div className="space-y-4 text-sm text-gray-300">
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2"><Terminal className="w-4 h-4 text-violet-400" /> Project Structure</h4>
                  <CodeBlock>{`cineverse/
├── src/
│   ├── pages/          # Page components (Home, Movie, Search, etc.)
│   ├── components/     # Reusable UI components
│   │   ├── layout/     # Navbar, Footer
│   │   ├── movies/     # MovieCard, MovieGrid, TrailerModal, etc.
│   │   └── ui/         # shadcn/ui base components
│   ├── entities/       # Data entity schemas
│   ├── lib/            # Utilities, auth context, query client
│   ├── api/            # Base44 SDK client
│   ├── App.jsx         # Router and app shell
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles & Tailwind tokens
├── index.html
├── tailwind.config.js
└── package.json`}</CodeBlock>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h4 className="text-white font-semibold mb-3">Content Filtering</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Content filtering is managed in <code className="text-violet-300 bg-gray-800 px-1.5 py-0.5 rounded">components/tmdb.js</code>. 
                    Blocked genres (Romance <code className="text-violet-300 bg-gray-800 px-1.5 py-0.5 rounded">10749</code>, Adult <code className="text-violet-300 bg-gray-800 px-1.5 py-0.5 rounded">10768</code>) 
                    are excluded from all API calls via the <code className="text-violet-300 bg-gray-800 px-1.5 py-0.5 rounded">without_genres</code> parameter, 
                    and results are additionally filtered client-side using keyword matching.
                  </p>
                </div>
              </div>
            </Section>

            {/* Usage */}
            <Section id="usage" icon={Play} title="Usage Guide">
              <div className="space-y-4">
                {[
                  { title: 'Browsing Movies', desc: 'The Home page displays trending, popular, top-rated, and upcoming movies. Click on any movie card to open its detail page with full info, cast, trailers, and reviews.' },
                  { title: 'Searching', desc: 'Use the search bar in the navbar or visit the Discover page. Filter results by genre, release year, and minimum rating.' },
                  { title: 'Watching Trailers', desc: 'On a movie detail page, click "Watch Trailer" to open the embedded YouTube player. If a trailer is restricted from embedding, a fallback thumbnail with a YouTube link is shown.' },
                  { title: 'Favorites & Watchlist', desc: 'Sign in and use the heart (❤️) and bookmark (🔖) buttons on any movie page to add it to your Favorites or Watchlist. Manage your lists from the navbar or Profile page.' },
                  { title: 'Writing Reviews', desc: 'On a movie detail page, navigate to the Reviews tab. Sign in, select a star rating, write your review, and submit. You can edit or delete your review any time.' },
                  { title: 'Profile & History', desc: 'Your Profile page shows account stats, watch history (auto-logged), all your favorites, watchlist, and reviews in a tabbed dashboard.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex gap-3">
                    <ChevronRight className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-white font-semibold text-sm mb-1">{title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Tech Stack */}
            <Section id="tech" icon={Package} title="Tech Stack">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  ['React 18', 'UI framework'],
                  ['Vite', 'Build tool'],
                  ['Tailwind CSS', 'Styling'],
                  ['shadcn/ui', 'UI components'],
                  ['React Router v6', 'Client routing'],
                  ['TanStack Query', 'Data fetching'],
                  ['Framer Motion', 'Animations'],
                  ['Lucide React', 'Icons'],
                  ['TMDB API', 'Movie data'],
                  ['YouTube IFrame API', 'Trailers'],
                  ['Recharts', 'Charts'],
                  ['React Markdown', 'Content rendering'],
                ].map(([name, desc]) => (
                  <div key={name} className="bg-gray-900 border border-gray-800 rounded-xl p-3">
                    <p className="text-white font-semibold text-sm">{name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Content Policy */}
            <Section id="content-policy" icon={Shield} title="Content Policy">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  CineVerse is designed to be a <strong className="text-white">family-safe</strong> platform. 
                  The following content is blocked at all levels:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-green-400 font-semibold text-sm mb-2">✅ Allowed</p>
                    <ul className="space-y-1 text-gray-400 text-sm">
                      {['Action & Adventure', 'Animation & Family', 'Comedy', 'Drama', 'Science Fiction', 'Fantasy', 'Documentary', 'History'].map(g => (
                        <li key={g} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-400" />{g}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-red-400 font-semibold text-sm mb-2">🚫 Blocked</p>
                    <ul className="space-y-1 text-gray-400 text-sm">
                      {['Adult / Explicit content', 'Romance genre (10749)', 'Adult genre (10768)', 'Movies with adult keywords', 'TMDB adult-flagged content'].map(g => (
                        <li key={g} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />{g}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-4">
                  See the full <Link to="/ContentPolicy" className="text-violet-400 hover:underline">Content Policy page</Link> for details.
                </p>
              </div>
            </Section>

            {/* Credits */}
            <Section id="credits" icon={Star} title="Credits">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4 pb-4 border-b border-gray-800">
                  <Globe className="w-6 h-6 text-violet-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">The Movie Database (TMDB)</p>
                    <p className="text-gray-400 text-sm mt-1">
                      This product uses the TMDB API but is not endorsed or certified by TMDB.
                      All movie data, images, and metadata are provided by{' '}
                      <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">themoviedb.org</a>.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Play className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">YouTube</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Trailer playback is powered by the{' '}
                      <a href="https://developers.google.com/youtube/iframe_api_reference" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">YouTube IFrame API</a>.
                      All trailers are property of their respective owners.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

          </main>
        </div>
      </div>
    </div>
  );
}