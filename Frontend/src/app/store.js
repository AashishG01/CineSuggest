import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import watchlistReducer from './features/watchlistSlice'; // <-- Import the new reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    watchlist: watchlistReducer // <-- Add it to the store
  }
});