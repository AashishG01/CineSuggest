import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchWatchlist, removeFromWatchlist } from '../app/features/watchlistSlice';
import MovieCard from '../components/MovieCard';
import { Film, Trash2, Loader, List } from 'lucide-react';

const WatchList = () => {
    const dispatch = useDispatch();

    // LOGIC CHANGE: Getting watchlist data and loading status directly from the Redux store.
    const { items: watchlist, status } = useSelector((state) => state.watchlist);
    
    // LOGIC CHANGE: Dispatching the fetchWatchlist action when the component mounts.
    // We only fetch if the status is 'idle' to avoid redundant API calls.
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchWatchlist());
        }
    }, [status, dispatch]);

    // LOGIC CHANGE: handleRemove now dispatches a Redux action.
    const handleRemove = (movieId) => {
        dispatch(removeFromWatchlist(movieId));
    };

    if (status === 'loading' || status === 'idle') {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="text-slate-600 dark:text-slate-400 text-lg">Loading your list...</p>
                </div>
            </div>
        );
    }

    return (
        // DESIGN CHANGE: Full page redesign with theme-aware colors.
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* DESIGN CHANGE: Header now uses the indigo accent color and themed text. */}
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-500/30">
                            <List className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white">My List</h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">
                                {watchlist.length} {watchlist.length === 1 ? 'Title' : 'Titles'} Saved
                            </p>
                        </div>
                    </div>
                </header>

                {watchlist.length === 0 ? (
                    // DESIGN CHANGE: Redesigned empty state card.
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-12 max-w-md">
                            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <Film className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Your list is empty</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                Add movies and shows to your list to see them here.
                            </p>
                            <Link
                                to="/"
                                className="inline-block px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg shadow-indigo-500/40"
                            >
                                Browse Movies
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {watchlist.map((movie) => (
                            <div key={movie.movieId} className="relative group">
                                {/* LOGIC CHANGE: MovieCard no longer needs the isInWatchlist prop. The data for OMDb needs mapping. */}
                                <MovieCard movie={{ 
                                    imdbID: movie.movieId, 
                                    Title: movie.title, 
                                    Poster: movie.posterPath, 
                                    Year: movie.releaseYear 
                                }} />

                                {/* DESIGN CHANGE: Redesigned remove button. */}
                                <button
                                    onClick={() => handleRemove(movie.movieId)}
                                    className="absolute -top-2 -right-2 z-20 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-600 hover:scale-110 active:scale-95 shadow-lg"
                                    title="Remove from list"
                                >
                                    <Trash2 className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchList;