import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../api/apiService'; // We'll use our organized API service

// Attempt to load user and token from localStorage for session persistence
const user = JSON.parse(localStorage.getItem('user'));
const accessToken = localStorage.getItem('accessToken');

const initialState = {
    user: user || null,
    token: accessToken || null,
    isAuthenticated: !!accessToken,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// --- Async Thunks ---

// Thunk for handling user registration
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            // The response.data will be our backend's ApiResponse
            const response = await apiService.register(userData); 
            // We don't automatically log in on register, just return a success message
            return response.message;
        } catch (error) {
            // Return the specific error message from the backend
            return rejectWithValue(error.data.message || 'Registration failed');
        }
    }
);

// Thunk for handling user login
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await apiService.login(credentials);
            // Save user and token to localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('accessToken', response.data.accessToken);
            // Return the user and token to be saved in the state
            return response.data;
        } catch (error) {
            return rejectWithValue(error.data.message || 'Login failed');
        }
    }
);

// --- Auth Slice Definition ---
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Synchronous action to log the user out
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        }
    },
    // extraReducers handles actions from createAsyncThunk
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.accessToken;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload; // The error message from rejectWithValue
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            })
            // Register cases (optional, here for loading/error states)
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;