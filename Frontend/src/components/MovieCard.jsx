import { useState } from 'react'; // Import useState
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Play, Plus, Check, Star, LibraryBig } from 'lucide-react';
import { addToWatchlist, removeFromWatchlist } from '../app/features/watchlistSlice';
import { PLACEHOLDER_IMAGE } from '../api/apiService';
import AddToListModal from './AddToListModal'; // Import the modal component

const MovieCard = ({ movie }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { items: watchlist } = useSelector((state) => state.watchlist);

    // State for controlling modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Checks if the current movie exists in the global Redux watchlist state
    const isInWatchlist = watchlist.some(item => item.movieId === movie.imdbID);

    // Dispatches a Redux action to add/remove from watchlist
    const handleWatchlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return;

        if (isInWatchlist) {
            dispatch(removeFromWatchlist(movie.imdbID));
        } else {
            const movieData = {
                movieId: movie.imdbID,
                title: movie.Title || 'N/A',
                posterPath: movie.Poster === 'N/A' ? PLACEHOLDER_IMAGE : movie.Poster,
                releaseYear: movie.Year || 'N/A',
            };
            dispatch(addToWatchlist(movieData));
        }
    };

    // Handler for "Add to Custom List" button - opens the modal
    const handleAddToListClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) return;
        setIsModalOpen(true); // Open the modal
    };

    // Handles broken image links from the API
    const handleImageError = (e) => {
        e.target.onerror = null; // Prevents infinite loops
        e.target.src = PLACEHOLDER_IMAGE;
    }

    return (
        // Use Fragment to return multiple top-level elements (Link + Modal)
        <>
            <Link
                to={`/movie/${movie.imdbID}`}
                className="group relative cursor-pointer overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl dark:hover:shadow-indigo-500/20 transition-all duration-300 ease-in-out block"
            >
                <div className="relative">
                    <img
                        src={movie.Poster === 'N/A' ? PLACEHOLDER_IMAGE : movie.Poster}
                        alt={movie?.Title}
                        onError={handleImageError}
                        className="w-full h-auto aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />

                    {/* Hover overlay with action buttons */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 sm:gap-3">
                        {/* Play Button (triggers Link navigation) */}
                        <button
                            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/90 text-slate-900 transition hover:scale-110 active:scale-95"
                            title="View Details"
                        >
                            <Play className="h-5 w-5 sm:h-6 sm:w-6 fill-current" />
                        </button>

                        {isAuthenticated && (
                            <>
                                {/* Add/Remove Watchlist Button */}
                                <button
                                    onClick={handleWatchlistToggle}
                                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/50 bg-slate-700/50 text-white transition hover:scale-110 hover:border-white active:scale-95"
                                    title={isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                                >
                                    {isInWatchlist ? <Check className="h-5 w-5 sm:h-6 sm:w-6" /> : <Plus className="h-5 w-5 sm:h-6 sm:w-6" />}
                                </button>

                                {/* Add to Custom List Button */}
                                <button
                                    onClick={handleAddToListClick} // Opens the modal
                                    className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/50 bg-slate-700/50 text-white transition hover:scale-110 hover:border-white active:scale-95"
                                    title="Add to Custom List"
                                >
                                    <LibraryBig className="h-5 w-5 sm:h-6 sm:w-6" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Title and Year below the poster */}
                <div className="p-3">
                    <h3 className="truncate font-bold text-slate-800 dark:text-white" title={movie?.Title}>
                        {movie?.Title || 'No Title'}
                    </h3>
                    <div className="mt-1 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                        <span>{movie?.Year || 'N/A'}</span>
                        <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            {/* Rating might not be available in OMDb search results */}
                            <span>{movie?.imdbRating || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Conditionally render the modal */}
            {isModalOpen && (
                <AddToListModal
                    movieToAdd={movie}
                    onClose={() => setIsModalOpen(false)} // Pass function to close modal
                />
            )}
        </>
    );
};

export default MovieCard;