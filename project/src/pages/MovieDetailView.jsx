import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieDetails from '../components/MovieDetails';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function MovieDetailView({ watchlist, onToggleWatchlist }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits`);
        const data = await res.json();
        
        if (data.id) {
          setMovie(data);
        } else {
          setError('Movie not found.');
        }
      } catch (err) {
        setError('Failed to fetch movie details from the database.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetail();
  }, [id]);

  const handleBack = () => {
    // Navigate back to catalog home page
    navigate('/');
  };

  const isWatchlisted = movie ? watchlist.some(item => item.id === movie.id) : false;

  return (
    <div className="container py-2 animate-fade-in">
      {/* Loading spinner */}
      {loading && (
        <div className="d-flex flex-column align-items-center justify-content-center my-5 py-5">
          <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <span className="text-secondary">Loading movie records...</span>
        </div>
      )}

      {/* Error Message */}
      {error && !loading && (
        <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger rounded-4 p-4 text-center my-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill d-block mb-2" style={{ fontSize: '2rem' }}></i>
          <span className="fw-semibold">{error}</span>
          <button className="btn btn-gold btn-sm d-block mx-auto mt-3" onClick={handleBack}>
            Back to Home
          </button>
        </div>
      )}

      {/* Movie Detail Component */}
      {!loading && movie && (
        <MovieDetails
          movie={movie}
          onClose={handleBack}
          isWatchlisted={isWatchlisted}
          onToggleWatchlist={onToggleWatchlist}
        />
      )}
    </div>
  );
}

export default MovieDetailView;
