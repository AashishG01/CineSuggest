import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../api/apiService';
import MovieCard from '../components/MovieCard'; // Reusing the existing MovieCard
import { Loader, List, Trash2, AlertTriangle } from 'lucide-react';

const ListPageDetail = () => {
    const { listId } = useParams(); // Get listId from the URL
    const [listDetails, setListDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchListDetails = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await apiService.getListDetails(listId);
            setListDetails(response.data);
        } catch (err) {
            setError('Failed to fetch list details.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchListDetails();
    }, [listId]); // Refetch if listId changes

    const handleRemoveMovie = async (movieId) => {
        if (!listId || !movieId) return;
        try {
            // Call API to remove movie, then refetch details to update UI
            await apiService.removeMovieFromList(listId, movieId);
            await fetchListDetails();
        } catch (err) {
            setError('Failed to remove movie from list.');
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error) {
         return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-center px-4">
                 <div className="flex flex-col items-center gap-4">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Error</h1>
                    <p className="text-slate-600 dark:text-slate-400">{error}</p>
                </div>
            </div>
        );
    }

    if (!listDetails) {
        return ( // Handle case where list might not be found after loading
             <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-center px-4">
                 <p className="text-slate-600 dark:text-slate-400">List not found.</p>
             </div>
        );
    }


    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Header */}
                <header className="mb-12">
                     <div className="flex items-center gap-4 mb-4">
                        <div className="bg-indigo-600 p-3 rounded-xl shadow-lg shadow-indigo-500/30">
                            <List className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white">{listDetails.listName}</h1>
                             {listDetails.description && <p className="text-slate-600 dark:text-slate-400 text-lg mt-1">{listDetails.description}</p>}
                             <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                {listDetails.movies.length} {listDetails.movies.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Movies Grid */}
                {listDetails.movies.length === 0 ? (
                    <p className="text-center text-slate-500 dark:text-slate-400 py-10">This list is empty. Add some movies!</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {listDetails.movies.map((movie) => (
                            <div key={movie.movieId} className="relative group">
                                {/* Map data from list structure to MovieCard props */}
                                <MovieCard movie={{
                                    imdbID: movie.movieId,
                                    Title: movie.title,
                                    Poster: movie.posterPath,
                                    Year: movie.releaseYear
                                }} />
                                {/* Remove Button specific to this list */}
                                <button
                                    onClick={() => handleRemoveMovie(movie.movieId)}
                                    className="absolute -top-2 -right-2 z-20 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-700 hover:scale-110 active:scale-95 shadow-lg shadow-red-500/30"
                                    title={`Remove from ${listDetails.listName}`}
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

export default ListPageDetail;