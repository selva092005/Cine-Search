import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

function WatchlistView({ watchlist, onToggleWatchlist }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 pb-2 border-bottom border-secondary border-opacity-10">
        <h3 className="text-white mb-0 fw-bold d-flex align-items-center gap-2">
          <i className="bi bi-bookmark-star-fill text-warning" style={{ filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.4))' }}></i> Saved Watchlist
        </h3>
        <span className="badge-gold">
          {watchlist.length} {watchlist.length === 1 ? 'Movie' : 'Movies'} Saved
        </span>
      </div>

      {watchlist.length === 0 ? (
        <div className="glass-panel p-5 text-center my-4 border border-secondary border-opacity-10 py-5">
          <div className="empty-watchlist-icon-wrapper">
            <i className="bi bi-bookmark-plus text-warning" style={{ fontSize: '3rem', filter: 'drop-shadow(0 0 12px rgba(255, 215, 0, 0.3))' }}></i>
          </div>
          <h4 className="text-white fw-bold mb-2">Your watchlist is empty</h4>
          <p className="text-secondary small col-md-6 mx-auto mb-4">
            Start exploring movies on the homepage. Click the bookmark icon on any card or "Add Watchlist" on the detail page to organize your ultimate collection here.
          </p>
          <button className="btn btn-gold px-4 py-2" onClick={() => navigate('/')}>
            <i className="bi bi-compass-fill me-2"></i> Explore Catalog
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-4">
          {watchlist.map((movie) => (
            <div key={movie.id} className="col">
              <MovieCard
                movie={movie}
                isWatchlisted={true}
                onToggleWatchlist={onToggleWatchlist}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WatchlistView;
