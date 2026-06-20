import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

function WatchlistView({ watchlist, onToggleWatchlist }) {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <h3 className="text-white mb-4 fw-bold d-flex align-items-center gap-2">
        <i className="bi bi-bookmark-star-fill text-warning"></i> Saved Watchlist
      </h3>

      {watchlist.length === 0 ? (
        <div className="glass-panel p-5 text-center my-4">
          <i className="bi bi-bookmark-plus text-secondary d-block mb-3" style={{ fontSize: '3.5rem' }}></i>
          <h5 className="text-secondary fw-semibold">Your watchlist is empty</h5>
          <p className="text-muted small col-md-6 mx-auto mb-4">
            Start exploring movies on the homepage and click the bookmark button or "Add Watchlist" to organize them here.
          </p>
          <button className="btn btn-gold btn-sm px-4 py-2" onClick={() => navigate('/')}>
            Explore Catalog
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
