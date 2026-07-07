import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetailView from './pages/MovieDetailView';
import WatchlistView from './pages/WatchlistView';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const IS_KEY_CONFIGURED = API_KEY && API_KEY !== 'your_tmdb_api_key_here';

function App() {
  // Watchlist state (synced with localStorage)
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('cine_watchlist_tmdb');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('cine_watchlist_tmdb', JSON.stringify(watchlist));
  }, [watchlist]);

  // Toggle watchlist item
  const handleToggleWatchlist = (movie) => {
    setWatchlist(prev => {
      const isAlreadyIn = prev.some(item => item.id === movie.id);
      if (isAlreadyIn) {
        return prev.filter(item => item.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  if (!IS_KEY_CONFIGURED) {
    return (
      <div className="container py-5">
        <header className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center gap-3 mb-2">
            <i className="bi bi-film text-warning" style={{ fontSize: '3rem', textShadow: '0 0 15px rgba(255, 215, 0, 0.4)' }}></i>
            <h1 className="fw-black display-4 mb-0 text-white" style={{ letterSpacing: '-1px' }}>
              CINE<span className="text-warning">SEARCH</span>
            </h1>
          </div>
          <p className="text-secondary fs-5 col-md-8 mx-auto">
            Discover your next favorite films, view ratings, explore budgets, and compile your ultimate watchlist using TMDb.
          </p>
        </header>

        {/* API Key Missing Alert */}
        <div className="glass-panel p-5 text-center my-4 border-warning border-opacity-20 animate-fade-in">
          <i className="bi bi-key-fill text-warning d-block mb-3" style={{ fontSize: '3rem' }}></i>
          <h4 className="text-white fw-bold mb-2">TMDb API Key Setup Required</h4>
          <p className="text-secondary col-md-8 mx-auto mb-4">
            This project uses the premium <strong>TMDb API</strong> for movie details and high-resolution posters.
            To get started, you will need a free API key.
          </p>
          <div className="bg-dark bg-opacity-50 p-4 rounded-4 text-start col-md-8 mx-auto border border-secondary border-opacity-20 mb-4">
            <h6 className="text-warning fw-semibold mb-2">Follow these simple steps:</h6>
            <ol className="text-secondary small mb-0 ps-3">
              <li className="mb-2">Create a free account at <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="text-info text-decoration-none">themoviedb.org</a>.</li>
              <li className="mb-2">Go to <strong>Settings &gt; API</strong> in your profile settings.</li>
              <li className="mb-2">Request an API Key (select "Developer" and fill out the details as "Educational/Portfolio Project").</li>
              <li className="mb-0">Open the <code>.env</code> file in this project and paste your key: <br />
                <code className="text-white bg-black px-2 py-1 rounded d-inline-block mt-2">VITE_TMDB_API_KEY=your_key_here</code>
              </li>
            </ol>
          </div>
          <p className="text-muted small mb-0">The development server will automatically hot-reload once you save the file.</p>
        </div>

        <footer className="text-center text-secondary small border-top border-secondary border-opacity-10 mt-5 pt-4">
          <p className="mb-1">&copy; {new Date().getFullYear()} CineSearch App. Rebuilt in React & Bootstrap.</p>
          <p className="text-muted">Powered by TMDb API. Designed with premium dark accents.</p>
        </footer>
      </div>
    );
  }

  return (
    <Router>
      <div className="container py-4">
        {/* Navigation & Header */}
        <header className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 mb-5 pb-3 border-bottom border-secondary border-opacity-10 animate-fade-in">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <i className="bi bi-film text-warning" style={{ fontSize: '2.2rem', filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.4))' }}></i>
            <h2 className="mb-0 brand-title-container">
              <span className="brand-title">CINE</span>
              <span className="brand-accent">SEARCH</span>
            </h2>
          </Link>

          {/* Navigation Links */}
          <nav className="d-flex gap-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `btn btn-sm px-3 py-2 ${isActive ? 'btn-gold' : 'btn-glass-outline'}`
              }
            >
              <i className="bi bi-compass me-2"></i> Browse Movies
            </NavLink>

            <NavLink
              to="/watchlist"
              className={({ isActive }) =>
                `btn btn-sm px-3 py-2 position-relative ${isActive ? 'btn-gold' : 'btn-glass-outline'}`
              }
            >
              <i className="bi bi-bookmarks-fill me-2"></i> Watchlist
              {watchlist.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill badge-count">
                  {watchlist.length}
                </span>
              )}
            </NavLink>
          </nav>
        </header>

        {/* Route Pages Content */}
        <main style={{ minHeight: '60vh' }}>
          <Routes>
            <Route
              path="/"
              element={<Home watchlist={watchlist} onToggleWatchlist={handleToggleWatchlist} />}
            />
            <Route
              path="/movie/:id"
              element={<MovieDetailView watchlist={watchlist} onToggleWatchlist={handleToggleWatchlist} />}
            />
            <Route
              path="/watchlist"
              element={<WatchlistView watchlist={watchlist} onToggleWatchlist={handleToggleWatchlist} />}
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="text-center text-secondary small border-top border-secondary border-opacity-10 mt-5 pt-4">
          <p className="mb-1">&copy; {new Date().getFullYear()} CineSearch App. Rebuilt in React & Bootstrap.</p>
          <p className="text-muted">Powered by TMDb API. Designed with premium dark accents.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
