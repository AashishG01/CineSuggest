import { useState, useEffect, useRef } from 'react';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { apiService } from '../api/apiService'; // LOGIC CHANGE: Using our centralized apiService

// LOGIC CHANGE: No longer needs useSelector or backendApi directly
// LOGIC CHANGE: Prop changed from 'fetchUrl' to 'category' for clarity
const MovieRow = ({ title, category }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLeftButton, setShowLeftButton] = useState(false);
  // Hide the right button by default until we know the row is scrollable
  const [showRightButton, setShowRightButton] = useState(false);
  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // LOGIC CHANGE: Fetching movies using a clean apiService function
        const fetchedMovies = await apiService.fetchMoviesByCategory(category);
        // console.log(`movies received for ${category}:`, fetchedMovies)
        setMovies(fetchedMovies);
      } catch (error) {
        // console.error(`Error fetching movies for category "${category}":`, error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [category]);
  
  // LOGIC CHANGE: Removed the entire useEffect for fetching the watchlist.
  // This is now handled globally by Redux and is a major performance improvement.
  // LOGIC CHANGE: Removed local watchlist state and the isInWatchlist function.
  // MovieCard now handles this logic internally via Redux.

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
      // Check if there's more content to scroll to on the right
      setShowRightButton(current.scrollLeft < current.scrollWidth - current.offsetWidth - 10);
    }
  };
  
  // This effect now also checks if the row is scrollable to begin with
  useEffect(() => {
    const { current } = rowRef;
    if (current) {
      // Check if the content is wider than the container
      const isScrollable = current.scrollWidth > current.offsetWidth;
      setShowRightButton(isScrollable);

      current.addEventListener('scroll', handleScroll);
      return () => {
        if(current) {
          current.removeEventListener('scroll', handleScroll);
        }
      }
    }
  }, [movies]); // Re-run when movies are loaded

  if (isLoading) {
    return (
      <div className="h-60 flex items-center justify-center">
          <Loader className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="group/row mb-12">
      {/* DESIGN CHANGE: Title uses theme-aware text colors */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-white">
        {title}
      </h2>

      <div className="relative">
        {/* DESIGN CHANGE: Scroll buttons redesigned for the new theme */}
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

        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-scroll scrollbar-hide py-4"
        >
          {movies.map((movie) => (
            <div
              key={movie.imdbID} // LOGIC CHANGE: OMDb search results use 'imdbID'
              className="flex-shrink-0 w-40 md:w-48"
            >
              {/* LOGIC CHANGE: MovieCard no longer needs the isInWatchlist prop */}
              {/* {console.log(movie)} */}
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;