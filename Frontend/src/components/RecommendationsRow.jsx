import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { apiService } from '../api/apiService';

const RecommendationsRow = ({ title = "Top Recommendations For You" }) => {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Start false, only load if authenticated
    const [error, setError] = useState('');
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);
    const rowRef = useRef(null);
    const { isAuthenticated } = useSelector((state) => state.auth); // Check if user is logged in
    
    useEffect(() => {
        // Only fetch recommendations if the user is authenticated
        if (!isAuthenticated) {
            setIsLoading(false); // Stop loading if not logged in
            return;
        }

        const fetchRecs = async () => {
            setIsLoading(true);
            setError('');
            setMovies([]); // Clear previous recommendations
            try {
                
                // 1. Get recommended IMDb IDs from your Node.js backend
                const recResponse = await apiService.getRecommendations();
                const recommendedIds = recResponse.data; // Assuming response.data is the array of IDs
                console.log(recommendedIds);
                if (!recommendedIds || recommendedIds.length === 0) {
                    setIsLoading(false);
                    return;
                }

                // 2. Fetch details for each recommended movie ID from OMDb
                const movieDetailsPromises = recommendedIds.map(id =>
                    apiService.fetchMovieDetails(id)
                );
                const movieDetailsResults = await Promise.all(movieDetailsPromises);

                const validMovies = movieDetailsResults.filter(
                    movie => movie && movie.Response === "True" && movie.Poster !== "N/A"
                );

                setMovies(validMovies);

            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setError("Could not load recommendations.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecs();
    }, [isAuthenticated]); // Re-fetch if authentication status changes


    // --- Scroll Logic ---
    const scroll = (direction) => {
        const { current } = rowRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -current.offsetWidth : current.offsetWidth;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleScroll = () => {
        const { current } = rowRef;
        if (current) {
            setShowLeftButton(current.scrollLeft > 10);
            setShowRightButton(current.scrollLeft < current.scrollWidth - current.offsetWidth - 10);
        }
    };

    useEffect(() => {
        const { current } = rowRef;
        if (current) {
            const isScrollable = current.scrollWidth > current.offsetWidth;
            // Initial check for buttons based on scroll position and scrollability
            setShowRightButton(isScrollable && current.scrollLeft < current.scrollWidth - current.offsetWidth - 10);
            setShowLeftButton(current.scrollLeft > 10);

            current.addEventListener('scroll', handleScroll);
            // Cleanup function to remove event listener
            return () => {
                // Ensure current exists before removing listener
                const node = current; 
                if (node) {
                    node.removeEventListener('scroll', handleScroll);
                }
            }
        }
    }, [movies]); // Dependency: re-check scrollability when movies load
    // --- End Scroll Logic ---

    // Don't render the row if not authenticated or if loading failed with no movies initially
    if (!isAuthenticated || (error && movies.length === 0)) {
        return null;
    }

    // Show loader only while actively fetching
    if (isLoading) {
        return (
            <div className="h-60 flex items-center justify-center">
                <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    // Handle case where recs fetched but resulted in 0 valid movies, or no initial watchlist
     if (movies.length === 0) {
        return (
            <div className="group/row mb-12">
                 <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                    {title}
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400">Add movies to your watchlist to get recommendations!</p>
            </div>
        );
    }


    return (
        <div className="group/row mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                {title}
            </h2>

            <div className="relative">
                {/* --- START: Full Scroll Button JSX --- */}
                {showLeftButton && (
                  <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 z-20 w-12 h-full bg-gradient-to-r from-slate-100 dark:from-slate-950 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    aria-label="Scroll left"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-500 dark:hover:text-indigo-400 text-slate-800 dark:text-white transition-all duration-300">
                      <ChevronLeft className="w-6 h-6" />
                    </div>
                  </button>
                )}
                {showRightButton && (
                  <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 z-20 w-12 h-full bg-gradient-to-l from-slate-100 dark:from-slate-950 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    aria-label="Scroll right"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-500 dark:hover:text-indigo-400 text-slate-800 dark:text-white transition-all duration-300">
                      <ChevronRight className="w-6 h-6" />
                    </div>
                  </button>
                )}
                {/* --- END: Full Scroll Button JSX --- */}

                {/* Movies Grid */}
                <div
                    ref={rowRef}
                    className="flex space-x-4 overflow-x-scroll scrollbar-hide py-4" // Added py-4 for vertical padding if buttons overlap
                >
                    {movies.map((movie) => (
                        <div
                            key={movie.imdbID}
                            className="flex-shrink-0 w-40 md:w-48"
                        >
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecommendationsRow;