import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiService, PLACEHOLDER_IMAGE } from '../api/apiService';
import { Loader, Star, Clock, Calendar, AlertTriangle } from 'lucide-react';
import { ReviewForm, ReviewList } from '../components/Reviews';

const MovieDetailPage = () => {
    // Get the movie's imdbID from the URL parameter
    const { imdbID } = useParams();

    // State for movie data, loading status, and errors
    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the reviews
    const [reviews, setReviews] = useState([]);

    // Get the currently logged-in user from the Redux store
    const { user } = useSelector((state) => state.auth);

    // Function to fetch reviews for the current movie
    const fetchMovieReviews = async () => {
        if (!imdbID) return;
        try {
            const reviewData = await apiService.getReviewsForMovie(imdbID);
            setReviews(reviewData.data);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
            // Optionally set an error state specific to reviews if needed
        }
    };

    // Main effect to fetch all page data when the imdbID changes
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on navigation

        const fetchAllData = async () => {
            setIsLoading(true);
            setError(null);
            setMovie(null); // Reset movie state for new fetch
            setReviews([]); // Reset reviews state for new fetch
            try {
                // Fetch the main movie details
                const movieData = await apiService.fetchMovieDetails(imdbID);
                if (movieData.Response === "True") {
                    setMovie(movieData);
                    // After successfully getting movie details, fetch the reviews
                    await fetchMovieReviews();
                } else {
                    setError(movieData.Error || "Movie not found.");
                }
            } catch (err) {
                setError("Failed to fetch movie details. Please try again later.");
                console.error("Fetch Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (imdbID) {
            fetchAllData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imdbID]); // Dependency array ensures this runs when imdbID changes

    // Function to handle broken image links from the API
    const handleImageError = (e) => {
        e.target.onerror = null; // Prevents infinite loops
        e.target.src = PLACEHOLDER_IMAGE;
    }

    // --- Conditional Rendering ---

    // Render loading state (covers initial load or loading after API call starts but before movie/error is set)
    if (isLoading || (!movie && !error)) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <Loader className="w-16 h-16 text-indigo-500 animate-spin" />
            </div>
        );
    }

    // Render error state if an error occurred during fetching
    if (error) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-center px-4">
                <div className="flex flex-col items-center gap-4">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Something Went Wrong</h1>
                    <p className="text-slate-600 dark:text-slate-400">{error}</p>
                </div>
            </div>
        );
    }

    // --- Prepare Data for Rendering ---

    // Find the current user's review from the fetched list
    const currentUserReview = reviews.find(review => review.user === user?._id);
    // Create a separate list of reviews from other users
    const otherUserReviews = reviews.filter(review => review.user !== user?._id);

    // --- Render Movie Details ---
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* --- Movie Details Section --- */}
                <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
                    {/* Left Column: Poster */}
                    <div className="md:col-span-1 lg:col-span-1">
                        <img
                            src={movie.Poster === 'N/A' ? PLACEHOLDER_IMAGE : movie.Poster}
                            alt={movie.Title}
                            onError={handleImageError}
                            className="w-full h-auto aspect-[2/3] object-cover rounded-xl shadow-2xl shadow-slate-300 dark:shadow-black"
                        />
                    </div>

                    {/* Right Column: Details */}
                    <div className="md:col-span-2 lg:col-span-3">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">{movie.Title}</h1>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2"><Calendar className="w-5 h-5" /><span className="font-medium">{movie.Year}</span></div>
                            <div className="flex items-center gap-2"><Clock className="w-5 h-5" /><span className="font-medium">{movie.Runtime}</span></div>
                            <div className="flex items-center gap-2"><span className="border border-slate-400 dark:border-slate-600 px-2 py-0.5 rounded text-xs font-bold">{movie.Rated}</span></div>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Plot</h2>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{movie.Plot}</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-sm">
                            <div><strong className="text-slate-800 dark:text-white block">Director:</strong> <span className="text-slate-600 dark:text-slate-400">{movie.Director}</span></div>
                            <div><strong className="text-slate-800 dark:text-white block">Writer:</strong> <span className="text-slate-600 dark:text-slate-400">{movie.Writer}</span></div>
                            <div className="col-span-full"><strong className="text-slate-800 dark:text-white block">Actors:</strong> <span className="text-slate-600 dark:text-slate-400">{movie.Actors}</span></div>
                            <div><strong className="text-slate-800 dark:text-white block">Genre:</strong> <span className="text-slate-600 dark:text-slate-400">{movie.Genre}</span></div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">Ratings</h2>
                            <div className="flex flex-wrap gap-4">
                                {movie.Ratings.map(rating => (
                                    <div key={rating.Source} className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-center min-w-[100px] flex-shrink-0">
                                        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{rating.Value}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{rating.Source}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- User Reviews Section --- */}
                <section className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">User Reviews</h2>

                    {/* Pass the found review to the form. It will be 'undefined' if no review exists. */}
                    <ReviewForm
                        movieId={imdbID}
                        existingReview={currentUserReview}
                        onReviewSubmitted={fetchMovieReviews} // Callback to refetch reviews after submit/update
                    />

                    {/* Pass the filtered list of other users' reviews to the list component. */}
                    <ReviewList
                        reviews={otherUserReviews}
                        onReviewDeleted={fetchMovieReviews} // Callback to refetch reviews after delete
                    />
                </section>
            </div>
        </div>
    );
};

export default MovieDetailPage;