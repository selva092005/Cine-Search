import React, { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const MovieDetails = ({ movie, onClose, isWatchlisted, onToggleWatchlist }) => {
  const {
    id,
    title,
    overview,
    release_date,
    tagline,
    budget,
    revenue,
    runtime,
    vote_average,
    genres,
    production_countries,
    spoken_languages,
    credits,
    status,
    poster_path
  } = movie;

  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  // Fetch movie trailers
  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
        const data = await res.json();
        if (data.results) {
          // Find standard Youtube trailer
          const trailer = data.results.find(
            video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
          );
          if (trailer) {
            setTrailerKey(trailer.key);
          }
        }
      } catch (err) {
        console.error('Error fetching trailer:', err);
      }
    };
    fetchTrailer();
  }, [id]);

  const posterUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w500${poster_path}` 
    : 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=400';

  const actors = credits?.cast
    ? credits.cast.slice(0, 5).map(c => c.name).join(', ')
    : 'N/A';

  const directors = credits?.crew
    ? credits.crew.filter(c => c.job === 'Director').map(c => c.name).join(', ')
    : 'N/A';

  const writers = credits?.crew
    ? credits.crew.filter(c => c.job === 'Writer' || c.job === 'Screenplay').map(c => c.name).join(', ')
    : 'N/A';

  const formattedBudget = budget ? `$${budget.toLocaleString()}` : 'N/A';
  const formattedRevenue = revenue ? `$${revenue.toLocaleString()}` : 'N/A';
  const countries = production_countries ? production_countries.map(c => c.name).join(', ') : 'N/A';
  const languages = spoken_languages ? spoken_languages.map(l => l.english_name).join(', ') : 'N/A';

  return (
    <div className="glass-panel p-4 p-md-5 animate-fade-in my-4 position-relative">
      
      {/* Back & Action Buttons Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <button className="btn btn-glass-outline btn-sm d-inline-flex align-items-center gap-2" onClick={onClose}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        
        <div className="d-flex gap-2">
          {trailerKey && (
            <button 
              className="btn btn-danger btn-sm d-inline-flex align-items-center gap-2 px-3"
              onClick={() => setShowTrailer(true)}
            >
              <i className="bi bi-play-btn-fill"></i> Watch Trailer
            </button>
          )}
          
          <button 
            className={`btn btn-sm d-inline-flex align-items-center gap-2 px-3 ${isWatchlisted ? 'btn-warning text-dark border-0' : 'btn-gold'}`}
            onClick={() => onToggleWatchlist(movie)}
          >
            <i className={`bi ${isWatchlisted ? 'bi-bookmark-dash-fill' : 'bi-bookmark-plus-fill'}`}></i>
            {isWatchlisted ? 'Remove Watchlist' : 'Add Watchlist'}
          </button>
        </div>
      </div>

      {/* Main Details Panel */}
      <div className="row g-4 g-lg-5 align-items-start">
        {/* Poster */}
        <div className="col-12 col-md-4 text-center">
          <div className="position-relative d-inline-block">
            <img 
              src={posterUrl} 
              alt={title} 
              className="img-fluid rounded-4 shadow-lg border border-secondary"
              style={{ maxHeight: '480px', objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
            />
            {vote_average !== undefined && vote_average > 0 && (
              <span className="badge-rating position-absolute top-3 start-3 d-flex align-items-center gap-1 shadow">
                <i className="bi bi-star-fill text-dark"></i> {vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* Text Details */}
        <div className="col-12 col-md-8">
          <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
            <span className="badge bg-secondary text-capitalize px-3 py-2 rounded-pill">{status}</span>
            <span className="badge bg-dark border border-secondary px-3 py-2 rounded-pill">{runtime ? `${runtime} min` : 'N/A'}</span>
          </div>

          <h2 className="display-5 fw-extrabold text-white mb-1">{title}</h2>
          {tagline && <p className="text-muted fst-italic fs-5 mb-2">"{tagline}"</p>}
          <p className="text-warning fs-5 fw-bold mb-4">{release_date ? release_date.split('-')[0] : 'N/A'}</p>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {genres && genres.map((genre, idx) => (
              <span key={genre.id || idx} className="badge-gold">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="mb-4">
            <h5 className="text-secondary fw-semibold mb-2">Overview</h5>
            <p className="lead text-light-50 fs-6 lh-lg">{overview || 'No overview available.'}</p>
          </div>

          <div className="row g-3 mt-2 border-top border-secondary pt-3">
            <div className="col-12 col-sm-6 spec-item">
              <div className="spec-label">Director</div>
              <div className="spec-value text-white">{directors}</div>
            </div>
            <div className="col-12 col-sm-6 spec-item">
              <div className="spec-label">Writer</div>
              <div className="spec-value text-white">{writers}</div>
            </div>
            <div className="col-12 col-sm-6 spec-item">
              <div className="spec-label">Actors</div>
              <div className="spec-value text-white">{actors}</div>
            </div>
            <div className="col-12 col-sm-6 spec-item">
              <div className="spec-label">Released</div>
              <div className="spec-value text-white">{release_date || 'N/A'}</div>
            </div>
            <div className="col-12 col-sm-6 spec-item">
              <div className="spec-label">Budget / Revenue</div>
              <div className="spec-value text-warning">
                <i className="bi bi-cash-coin me-1"></i> {formattedBudget} / {formattedRevenue}
              </div>
            </div>
            <div className="col-12 col-sm-6 spec-item">
              <div className="spec-label">Country & Language</div>
              <div className="spec-value text-white">{countries} ({languages})</div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive YouTube Video Trailer Modal Overlay */}
      {showTrailer && trailerKey && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            zIndex: 9999, 
            background: 'rgba(10, 10, 15, 0.9)', 
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)' 
          }}
          onClick={() => setShowTrailer(false)}
        >
          <div 
            className="position-relative w-100 px-3" 
            style={{ maxWidth: '850px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="btn btn-outline-light rounded-circle position-absolute" 
              style={{ top: '-50px', right: '15px', width: '40px', height: '40px', padding: 0 }}
              onClick={() => setShowTrailer(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            {/* Responsive Aspect Ratio Wrapper */}
            <div className="ratio ratio-16x9 rounded-4 overflow-hidden border border-secondary shadow-2xl">
              <iframe 
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`} 
                title={`${title} Official Trailer`} 
                allowFullScreen
                allow="autoplay; encrypted-media"
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieDetails;
