import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/apiService';

const initialState = {
    items: [], // Will hold the full movie objects from the watchlist
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// --- Async Thunks for Watchlist ---

export const fetchWatchlist = createAsyncThunk(
    'watchlist/fetchWatchlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.getWatchlist();
            return response.data; // The array of movie objects
        } catch (error) {
            return rejectWithValue(error.data?.message || 'Failed to fetch watchlist');
        }
    }
);

export const addToWatchlist = createAsyncThunk(
    'watchlist/addToWatchlist',
    async (movieData, { rejectWithValue }) => {
        try {
            const response = await apiService.addToWatchlist(movieData);
            return response.data; // The updated watchlist array
        } catch (error) {
            return rejectWithValue(error.data?.message || 'Failed to add to watchlist');
        }
    }
);

export const removeFromWatchlist = createAsyncThunk(
    'watchlist/removeFromWatchlist',
    async (movieId, { rejectWithValue }) => {
        try {
            const response = await apiService.removeFromWatchlist(movieId);
            return response.data; // The updated watchlist array
        } catch (error) {
            return rejectWithValue(error.data?.message || 'Failed to remove from watchlist');
        }
    }
);

const watchlistSlice = createSlice({
    name: 'watchlist',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWatchlist.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWatchlist.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchWatchlist.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(addToWatchlist.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(removeFromWatchlist.fulfilled, (state, action) => {
                state.items = action.payload;
            });
    }
});

export default watchlistSlice.reducer;