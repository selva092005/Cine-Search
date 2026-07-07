import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Selected popular genres for filters
const GENRES = [
  { id: '', name: 'All Genres' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' }
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Release Date (Newest)' }
];

function Home({ watchlist, onToggleWatchlist }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState(''); // Stores the search query currently active
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtering & Sorting states
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Netflix-style Hero Banner states
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroMovie, setHeroMovie] = useState(null);
  const [heroTrailerKey, setHeroTrailerKey] = useState(null);
  const [showHeroTrailer, setShowHeroTrailer] = useState(false);

  // Search History state
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('cine_history_tmdb');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync history to localStorage
  useEffect(() => {
    localStorage.setItem('cine_history_tmdb', JSON.stringify(history));
  }, [history]);

  // Fetch full details and video keys for the Hero Movie
  const fetchHeroDetails = async (id) => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos`);
      const data = await res.json();
      if (data.id) {
        setHeroMovie(data);
        if (data.videos && data.videos.results) {
          const trailer = data.videos.results.find(
            v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
          );
          if (trailer) {
            setHeroTrailerKey(trailer.key);
          } else {
            setHeroTrailerKey(null);
          }
        }
      }
    } catch (err) {
      console.error('Error loading hero movie details:', err);
    }
  };

  // Load movies on filters/sorting/page change
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = '';
        if (activeSearch) {
          // If searching by keyword
          url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(activeSearch)}&language=en-US&page=${page}`;
        } else {
          // If browsing popular/filtered lists
          const genreParam = selectedGenre ? `&with_genres=${selectedGenre}` : '';
          url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}${genreParam}&language=en-US&page=${page}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        if (data.results && data.results.length > 0) {
          let results = data.results;

          // Client-side genre filtering for Search Results (TMDb search doesn't support with_genres parameter)
          if (activeSearch && selectedGenre) {
            results = results.filter(movie => 
              movie.genre_ids && movie.genre_ids.includes(Number(selectedGenre))
            );
          }

          setMovies(results);
          setTotalPages(data.total_pages > 500 ? 500 : data.total_pages); // TMDb API max page limit is 500
        } else {
          setMovies([]);
          setError(activeSearch ? `No results found for "${activeSearch}"` : 'No movies match your filters.');
        }
      } catch (err) {
        setError('Failed to fetch movies. Please check your internet connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [activeSearch, selectedGenre, sortBy, page]);

  // Reset heroIndex when page or search active state changes
  useEffect(() => {
    setHeroIndex(0);
  }, [activeSearch, selectedGenre, sortBy, page]);

  // Fetch full details and trailer keys for the currently featured Hero Movie
  useEffect(() => {
    const loadHeroMovie = async () => {
      if (!activeSearch && page === 1 && !selectedGenre && movies.length > 0 && movies[heroIndex]) {
        await fetchHeroDetails(movies[heroIndex].id);
      } else {
        setHeroMovie(null);
      }
    };
    loadHeroMovie();
  }, [movies, heroIndex, activeSearch, page, selectedGenre]);

  const handleNextHero = () => {
    if (movies.length > 0) {
      const maxIndex = Math.min(movies.length, 5); // Limit carousel to Top 5 movies
      setHeroIndex(prev => (prev + 1) % maxIndex);
    }
  };

  const handlePrevHero = () => {
    if (movies.length > 0) {
      const maxIndex = Math.min(movies.length, 5); // Limit carousel to Top 5 movies
      setHeroIndex(prev => (prev - 1 + maxIndex) % maxIndex);
    }
  };

  // Autoplay slideshow every 7 seconds
  useEffect(() => {
    if (!heroMovie || activeSearch || page !== 1 || selectedGenre) return;
    
    const interval = setInterval(() => {
      handleNextHero();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [heroMovie, activeSearch, page, selectedGenre, movies]);

  const isWatchlisted = (movieId) => watchlist.some(item => item.id === movieId);

  // Determine grid movies list (slice off the currently featured movie from list if hero banner is showing)
  const displayMovies = (heroMovie && !activeSearch && page === 1 && !selectedGenre) 
    ? movies.filter(movie => movie.id !== heroMovie.id) 
    : movies;

  // Trigger search on submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setPage(1);
    setActiveSearch(searchQuery);

    // Save search to history
    setHistory(prev => {
      const filtered = prev.filter(h => h.toLowerCase() !== searchQuery.toLowerCase());
      return [searchQuery, ...filtered].slice(0, 5);
    });
  };

  // Trigger click on history pill
  const handleHistoryClick = (queryText) => {
    setSearchQuery(queryText);
    setActiveSearch(queryText);
    setPage(1);
  };

  // Reset all filters and view popular items
  const handleClearAll = () => {
    setSearchQuery('');
    setActiveSearch('');
    setSelectedGenre('');
    setSortBy('popularity.desc');
    setPage(1);
  };

  return (
    <div>
      {/* Netflix-Style Hero Banner (Only page 1 of Browse) */}
      {!loading && !error && heroMovie && (
        <div 
          className="hero-banner animate-fade-in"
          style={{ 
            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})` 
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content text-start">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge bg-warning text-dark fw-bold px-2 py-1 rounded">FEATURED #{heroIndex + 1}</span>
              {heroMovie.vote_average > 0 && (
                <span className="badge bg-dark border border-secondary text-light fw-bold px-2 py-1 rounded d-flex align-items-center gap-1">
                  <i className="bi bi-star-fill text-warning"></i> {heroMovie.vote_average.toFixed(1)}
                </span>
              )}
            </div>
            <h1 className="hero-title text-white fw-black mb-1">{heroMovie.title}</h1>
            {heroMovie.tagline && <p className="hero-tagline mb-3">"{heroMovie.tagline}"</p>}
            <p className="hero-overview mb-4 d-none d-md-block" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {heroMovie.overview}
            </p>
            
            <div className="d-flex flex-wrap gap-2 mt-2">
              <button 
                className="btn btn-gold px-4 py-2 d-flex align-items-center gap-2"
                onClick={() => navigate(`/movie/${heroMovie.id}`)}
              >
                <i className="bi bi-info-circle-fill"></i> View Details
              </button>
              {heroTrailerKey && (
                <button 
                  className="btn btn-danger px-4 py-2 d-flex align-items-center gap-2"
                  onClick={() => setShowHeroTrailer(true)}
                >
                  <i className="bi bi-play-btn-fill"></i> Play Trailer
                </button>
              )}
              <button 
                className="btn btn-glass-outline px-4 py-2 d-flex align-items-center gap-2"
                onClick={() => onToggleWatchlist(heroMovie)}
              >
                <i className={`bi ${isWatchlisted(heroMovie.id) ? 'bi-bookmark-dash-fill text-warning' : 'bi-bookmark-plus text-light'}`}></i>
                {isWatchlisted(heroMovie.id) ? 'Remove Watchlist' : 'Add Watchlist'}
              </button>
            </div>
          </div>

          {/* Carousel Navigation Arrows */}
          <button 
            type="button"
            className="hero-arrow-btn hero-arrow-left"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevHero();
            }}
            aria-label="Previous Featured Movie"
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          
          <button 
            type="button"
            className="hero-arrow-btn hero-arrow-right"
            onClick={(e) => {
              e.stopPropagation();
              handleNextHero();
            }}
            aria-label="Next Featured Movie"
          >
            <i className="bi bi-chevron-right"></i>
          </button>

          {/* Carousel Dots Indicator */}
          <div className="hero-dots-container">
            {movies.slice(0, 5).map((_, idx) => (
              <span 
                key={idx} 
                className={`hero-dot ${idx === heroIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setHeroIndex(idx);
                }}
              ></span>
            ))}
          </div>
        </div>
      )}

      {/* Search Panel */}
      <div className="glass-panel p-4 mb-4 animate-fade-in">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center">
          <div className="col-12 col-md-9 position-relative">
            <i className="bi bi-search position-absolute text-secondary" style={{ left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}></i>
            <input
              type="text"
              className="form-control custom-input w-100 ps-5"
              placeholder="Search by title"
           value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <button type="submit" className="btn btn-gold w-100 d-flex justify-content-center align-items-center gap-2">
              <i className="bi bi-search"></i> Search Movie
            </button>
          </div>
        </form>

        {/* History Pills */}
        {history.length > 0 && (
          <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
            <span className="text-secondary small me-1">Recents:</span>
            {history.map((hist, idx) => (
              <span
                key={idx}
                className="history-pill"
                onClick={() => handleHistoryClick(hist)}
              >
                {hist}
              </span>
            ))}
            <button 
              className="btn btn-link text-danger btn-sm p-0 ms-2 text-decoration-none"
              onClick={() => setHistory([])}
            >
              Clear History
            </button>
          </div>
        )}
      </div>

      {/* Filters & Sorting Panel */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4 animate-fade-in">
        <div className="d-flex flex-wrap gap-2 align-items-center">
          {/* Genre Filter */}
          <select 
            className="form-select custom-input py-2" 
            style={{ width: 'auto', minWidth: '160px' }}
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setPage(1);
            }}
          >
            {GENRES.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>

          {/* Sort Option (Only available when browsing, not active keyword search) */}
          {!activeSearch && (
            <select 
              className="form-select custom-input py-2" 
              style={{ width: 'auto', minWidth: '180px' }}
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          )}

          {/* Clear Filter Indicator */}
          {(activeSearch || selectedGenre || sortBy !== 'popularity.desc') && (
            <button className="btn btn-glass-outline btn-sm py-2 px-3" onClick={handleClearAll}>
              <i className="bi bi-x-circle me-1"></i> Clear filters
            </button>
          )}
        </div>

        {/* Catalog Header */}
        {activeSearch && (
          <h5 className="text-secondary fw-semibold mb-0">
            Search results for "{activeSearch}"
          </h5>
        )}
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="d-flex flex-column align-items-center justify-content-center my-5 py-5">
          <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <span className="text-secondary">Fetching movies database...</span>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger rounded-4 p-4 text-center my-4 animate-fade-in" role="alert">
          <i className="bi bi-exclamation-triangle-fill d-block mb-2" style={{ fontSize: '2rem' }}></i>
          <span className="fw-semibold">{error}</span>
          <button className="btn btn-gold btn-sm d-block mx-auto mt-3" onClick={handleClearAll}>
            Reset View
          </button>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && !error && displayMovies.length > 0 && (
        <div className="animate-fade-in">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-6 g-4">
            {displayMovies.map(movie => (
              <div key={movie.id} className="col">
                <MovieCard
                  movie={movie}
                  isWatchlisted={isWatchlisted(movie.id)}
                  onToggleWatchlist={onToggleWatchlist}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="d-flex justify-content-between align-items-center border-top border-secondary border-opacity-15 mt-5 pt-4">
            <button 
              className="btn btn-glass-outline d-inline-flex align-items-center gap-2"
              disabled={page === 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              <i className="bi bi-arrow-left"></i> Previous
            </button>
            <span className="text-secondary fw-semibold">
              Page {page} of {totalPages || 1}
            </span>
            <button 
              className="btn btn-glass-outline d-inline-flex align-items-center gap-2"
              disabled={page === totalPages}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* Hero YouTube Trailer Modal Overlay */}
      {showHeroTrailer && heroTrailerKey && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ 
            zIndex: 9999, 
            background: 'rgba(10, 10, 15, 0.9)', 
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)' 
          }}
          onClick={() => setShowHeroTrailer(false)}
        >
          <div 
            className="position-relative w-100 px-3" 
            style={{ maxWidth: '850px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="btn btn-outline-light rounded-circle position-absolute" 
              style={{ top: '-50px', right: '15px', width: '40px', height: '40px', padding: 0 }}
              onClick={() => setShowHeroTrailer(false)}
            >
              <i className="bi bi-x-lg"></i>
            </button>
            
            <div className="ratio ratio-16x9 rounded-4 overflow-hidden border border-secondary shadow-2xl">
              <iframe 
                src={`https://www.youtube.com/embed/${heroTrailerKey}?autoplay=1`} 
                title={`${heroMovie?.title} Official Trailer`} 
                allowFullScreen
                allow="autoplay; encrypted-media"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
