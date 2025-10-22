console.log(import.meta.env.VITE_OMDB_API_KEY)

import axios from 'axios';

// --- External API: OMDb ---
// We will use this instance for all calls to the OMDb API.
export const omdbApi = axios.create({
    baseURL: 'https://www.omdbapi.com/',
    params: {
        apikey: import.meta.env.VITE_OMDB_API_KEY
    }
});

// --- Internal API: Your Backend ---
// This remains the same. It's for all calls to your own server.
export const backendApi = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1` || 'http://localhost:8000/api/v1',
    withCredentials: true
});

// --- Axios Interceptor ---
// This also remains the same. It adds your auth token to backend requests.
backendApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);