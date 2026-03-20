import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

// Pages
import Home from './pages/Home';
import Movie from './pages/Movie';
import SearchPage from './pages/Search';
import FavoritesPage from './pages/Favorites';
import WatchlistPage from './pages/Watchlist';
import ProfilePage from './pages/Profile';
import ContentPolicyPage from './pages/ContentPolicy';
import ReadmePage from './pages/Readme';


// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';


const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => setUser(null));
  }, []);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-950">
        <div className="w-8 h-8 border-4 border-gray-700 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <div className="dark">
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Navigate to="/Home" replace />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Movie/:id" element={<Movie />} />
          <Route path="/Search" element={<SearchPage />} />
          <Route path="/Favorites" element={<FavoritesPage />} />
          <Route path="/Watchlist" element={<WatchlistPage />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/ContentPolicy" element={<ContentPolicyPage />} />
          <Route path="/Readme" element={<ReadmePage />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;