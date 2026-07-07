import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, isWatchlisted, onToggleWatchlist }) => {
  const { title, release_date, poster_path, id, vote_average } = movie;
  const navigate = useNavigate();

  const year = release_date ? release_date.split('-')[0] : 'N/A';
  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}` 
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=350';

  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  return (
    <div 
      className="movie-card h-100 animate-fade-in"
      onClick={handleCardClick}
    >
      <div className="poster-container">
        <img src={posterUrl} alt={title} loading="lazy" />
        
        {/* Rating Badge at Top-Left */}
        {vote_average !== undefined && vote_average > 0 && (
          <span 
            className="badge bg-warning text-dark position-absolute fw-bold d-flex align-items-center gap-1 shadow"
            style={{ zIndex: 10, top: '10px', left: '10px', fontSize: '0.8rem', padding: '5px 8px', borderRadius: '8px' }}
          >
            <i className="bi bi-star-fill" style={{ fontSize: '0.75rem' }}></i> {vote_average.toFixed(1)}
          </span>
        )}

        {/* View Details button */}
        <button
          className="card-action-btn"
          style={{ right: '54px' }}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          title="View Movie Details"
          aria-label="View Movie Details"
        >
          <i className="bi bi-eye-fill" style={{ fontSize: '1.1rem' }}></i>
        </button>

        {/* Watchlist Quick Toggle button */}
        <button
          className="card-action-btn"
          style={{ right: '10px' }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie);
          }}
          title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          aria-label={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <i className={`bi ${isWatchlisted ? 'bi-bookmark-dash-fill text-warning' : 'bi-bookmark-plus text-light'}`} style={{ fontSize: '1.1rem' }}></i>
        </button>

        <div className="card-overlay">
          <span className="badge-gold align-self-start mb-2">{year}</span>
          <h5 className="text-white fw-bold mb-1 text-truncate" title={title}>{title}</h5>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-secondary small">View details</span>
            <i className="bi bi-arrow-right-short text-warning" style={{ fontSize: '1.2rem' }}></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
