import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../api/apiService';
import MovieCard from '../components/MovieCard';
import { Loader, Search } from 'lucide-react';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');

    useEffect(() => {
        // Clear results if the query is empty
        if (!query) {
            setSearchResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const results = await apiService.fetchMoviesByCategory(query);
                // Filter out duplicates based on imdbID
                const uniqueResults = results.filter((movie, index, self) =>
                    index === self.findIndex((m) => m.imdbID === movie.imdbID)
                );
                setSearchResults(uniqueResults);
            } catch (error) {
                console.error("Failed to fetch search results:", error);
                setSearchResults([]); // Set empty array on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]); // Re-run the search whenever the query in the URL changes

    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pt-24 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-8">
                    {/* Show appropriate heading based on loading state and query */}
                    {isLoading ? 'Searching...' : (query ? `Results for "${query}"` : 'Search for movies')}
                </h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="w-12 h-12 text-indigo-500 animate-spin" />
                    </div>
                ) : searchResults.length > 0 ? (
                    // Grid for displaying movie cards
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {searchResults.map((movie) => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))}
                    </div>
                ) : (
                    // Message shown when no results are found
                    <div className="flex flex-col items-center justify-center text-center py-20">
                         <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-12 max-w-md">
                            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                                <Search className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No results found</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                We couldn't find any movies matching "{query}". Try a different keyword.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;