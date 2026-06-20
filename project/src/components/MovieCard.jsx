import React from 'react';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, isWatchlisted, onToggleWatchlist }) => {
  const { title, release_date, poster_path, id } = movie;
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
        
        {/* View Details button */}
        <button
          className="btn position-absolute bg-dark bg-opacity-75 text-info rounded-circle p-0 border-0 d-flex align-items-center justify-content-center"
          style={{ zIndex: 10, top: '10px', right: '54px', width: '38px', height: '38px' }}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          title="View Movie Details"
          aria-label="View Movie Details"
        >
          <i className="bi bi-eye-fill text-light" style={{ fontSize: '1.15rem' }}></i>
        </button>

        {/* Watchlist Quick Toggle button */}
        <button
          className="btn position-absolute bg-dark bg-opacity-75 text-warning rounded-circle p-0 border-0 d-flex align-items-center justify-content-center"
          style={{ zIndex: 10, top: '10px', right: '10px', width: '38px', height: '38px' }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie);
          }}
          title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          aria-label={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <i className={`bi ${isWatchlisted ? 'bi-bookmark-dash-fill text-warning' : 'bi-bookmark-plus text-light'}`} style={{ fontSize: '1.15rem' }}></i>
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
