import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Play, Info, Plus, Check, Loader } from 'lucide-react';
import { apiService } from '../api/apiService';
import { fetchWatchlist, addToWatchlist, removeFromWatchlist } from '../app/features/watchlistSlice';

// A predefined list of popular movie IMDb IDs for OMDb.
const featuredMovieIds = [
  // Hollywood
  'tt1375666', // Inception
  'tt0468569', // The Dark Knight
  'tt0816692', // Interstellar
  'tt6751668', // Parasite
  'tt0133093', // The Matrix
  'tt0109830', // Forrest Gump
  // Recent Bollywood (Add more as needed)
  'tt10847118', // Pathaan
  'tt12844910', // Jawan
  'tt11663228', // Brahmāstra Part One: Shiva
  'tt15477488', // Animal
  'tt14050356', // Dunki
  'tt21307044', // Rocky Aur Rani Kii Prem Kahaani
];

const HeroBanner = () => {
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items: watchlist, status: watchlistStatus } = useSelector((state) => state.watchlist);

  const isInWatchlist = watchlist.some(item => item.movieId === movie?.imdbID);

  useEffect(() => {
    if (isAuthenticated && watchlistStatus === 'idle') {
      dispatch(fetchWatchlist());
    }

    async function fetchHeroMovie() {
      setIsLoading(true);
      try {
        const randomId = featuredMovieIds[Math.floor(Math.random() * featuredMovieIds.length)];
        const randomMovie = await apiService.fetchMovieDetails(randomId);

        if (randomMovie.Response === "True" && randomMovie.Poster !== "N/A") {
          setMovie(randomMovie);
        } else {
            // Handle case where OMDb might fail for a specific ID
            console.warn(`Could not fetch details for ID: ${randomId}. Response: ${randomMovie.Error}`);
            // Optionally: Try fetching another movie if the first attempt fails
            fetchHeroMovie(); // Recursive call, be careful with this pattern
        }
      } catch (error) {
        console.error('Error fetching hero banner movie:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHeroMovie();
    // Use imdbID array length as a dependency to avoid infinite loop potential with the recursive call
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, dispatch, watchlistStatus, featuredMovieIds.length]);

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !movie) return;

    if (isInWatchlist) {
      dispatch(removeFromWatchlist(movie.imdbID));
    } else {
      const movieData = {
        movieId: movie.imdbID,
        title: movie.Title,
        posterPath: movie.Poster,
        releaseYear: movie.Year,
      };
      dispatch(addToWatchlist(movieData));
    }
  };

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  };

  if (isLoading || !movie) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <Loader className="w-16 h-16 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <header
      className="relative h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${movie?.Poster})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-slate-950 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate-100/80 dark:from-black/80 via-transparent to-transparent"></div>


      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-2xl space-y-5 animate-fadeIn">
             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white drop-shadow-xl leading-tight">
              {movie?.Title}
            </h1>
             <div className="flex items-center space-x-4 text-sm md:text-base">
               <div className="flex items-center space-x-2 bg-yellow-400 px-3 py-1 rounded-md text-slate-900 font-bold">
                 <span>⭐</span>
                 <span>{movie?.imdbRating}</span>
               </div>
               <span className="font-semibold text-slate-600 dark:text-slate-300">
                 {movie?.Year}
               </span>
               <span className="font-semibold text-slate-600 dark:text-slate-300 border-l border-slate-400 dark:border-slate-600 pl-4">
                 {movie?.Rated}
               </span>
             </div>
             <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl font-medium">
              {truncate(movie?.Plot, 180)}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to={`/movie/${movie.imdbID}`}
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <Play className="w-6 h-6 fill-current" />
                <span className="text-lg">Play</span>
              </Link>

              {isAuthenticated && (
                <button
                  onClick={handleWatchlistToggle}
                  className="group flex items-center justify-center gap-2 px-6 py-3 bg-slate-500/50 dark:bg-slate-700/70 backdrop-blur-md text-slate-800 dark:text-white font-bold rounded-lg shadow-lg hover:bg-slate-500/70 dark:hover:bg-slate-700/90 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {isInWatchlist ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                  <span className="text-lg">{isInWatchlist ? 'In My List' : 'Add to List'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroBanner;