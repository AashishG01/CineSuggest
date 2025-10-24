import { omdbApi, backendApi } from './axios.js';

// This is a placeholder for movies that don't have a poster
export const PLACEHOLDER_IMAGE = '/placeholder.png';

// --- API Service Object ---
export const apiService = {
    // --- OMDb API Calls ---
    
    // Simulate fetching trending movies by searching for a keyword like "popular"
    fetchTrending: async () => {
        const response = await omdbApi.get('/?s=popular&type=movie');
        // The actual movie list is in the 'Search' property
        return response.data.Search || [];
    },
    
    // Simulate fetching top-rated movies by searching for "best"
    fetchTopRated: async () => {
        const response = await omdbApi.get('/?s=best&type=movie');
        return response.data.Search || [];
    },

    // Fetch movies by a specific category/genre keyword
    fetchMoviesByCategory: async (category) => {
        const response = await omdbApi.get(`/?s=${category}&type=movie`);
        return response.data.Search || [];
    },

    // Fetch details for a single movie by its IMDb ID
    fetchMovieDetails: async (imdbID) => {
        const response = await omdbApi.get(`/?i=${imdbID}&plot=full`);
        return response.data;
    },

    // --- Backend API Calls (These are for your own server) ---

    // Auth
    register: async (userData) => {
        const response = await backendApi.post('/users/register', userData);
        return response.data;
    },
    login: async (credentials) => {
        const response = await backendApi.post('/users/login', credentials);
        return response.data;
    },
    logout: async () => {
        const response = await backendApi.post('/users/logout');
        return response.data;
    },

    // Watchlist
    getWatchlist: async () => {
        const response = await backendApi.get('/users/watchlist');
        return response.data;
    },
    addToWatchlist: async (movieData) => {
        const response = await backendApi.post('/users/watchlist/add', movieData);
        return response.data;
    },
    removeFromWatchlist: async (movieId) => {
        const response = await backendApi.post('/users/watchlist/remove', { movieId });
        return response.data;
    },
    getReviewsForMovie: async (movieId) => {
        const response = await backendApi.get(`/reviews/${movieId}`);
        return response.data;
    },
    createReview: async (reviewData) => {
        // reviewData will be { movieId, rating, comment }
        const response = await backendApi.post('/reviews', reviewData);
        return response.data;
    },
    deleteReview: async (reviewId) => {
        const response = await backendApi.delete(`/reviews/${reviewId}`);
        return response.data;
    },
    updateReview: async (reviewId, reviewData) => {
        // reviewData will be { rating, comment }
        const response = await backendApi.patch(`/reviews/${reviewId}`, reviewData);
        return response.data;
    },
    // custom list api calls
    createCustomList: async (listData) => {
        // listData will be { listName, description }
        const response = await backendApi.post('/lists', listData);
        return response.data;
    },
    getUserLists: async () => {
        const response = await backendApi.get('/lists');
        return response.data;
    },
    getListDetails: async (listId) => {
        const response = await backendApi.get(`/lists/${listId}`);
        return response.data;
    },
    addMovieToList: async (listId, movieData) => {
        // movieData will be { movieId, title, posterPath, releaseYear }
        const response = await backendApi.patch(`/lists/${listId}/add`, movieData);
        return response.data;
    },
    removeMovieFromList: async (listId, movieId) => {
        const response = await backendApi.patch(`/lists/${listId}/remove`, { movieId });
        return response.data;
    },
    deleteCustomList: async (listId) => {
        const response = await backendApi.delete(`/lists/${listId}`);
        return response.data;
    },
    getRecommendations: async () => {
        const response = await backendApi.get('/users/recommendations');
        // response.data should be the ApiResponse containing the array of IDs
        return response.data;
    }
};