import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import reviewRouter from './routes/review.routes.js';
import listRouter from './routes/customList.routes.js';

// Initialize the Express application
const app = express();

// --- Middleware Configuration ---

// 1. CORS (Cross-Origin Resource Sharing)
// This middleware allows your frontend (running on a different origin/port)
// to make requests to this backend.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// 2. JSON Parser
// This middleware parses incoming request bodies with JSON payloads.
// The 'limit' option prevents errors from overly large JSON payloads.
app.use(express.json({ limit: "16kb" }));

// 3. URL-encoded Parser
// This middleware parses incoming requests with URL-encoded payloads (e.g., from HTML forms).
// 'extended: true' allows for rich objects and arrays to be encoded.
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 4. Static File Server
// This middleware serves static files (like images, CSS, etc.) from the 'public' folder.
// For example, any user-uploaded avatars will be stored here.
app.use(express.static("public"));

// 5. Cookie Parser
// This middleware parses cookies attached to the client request object.
// It's essential for reading the access and refresh tokens we'll be sending.
app.use(cookieParser());


// --- Routes Declaration ---

// Import the user router
import userRouter from './routes/user.routes.js';

// Tell the app to use the imported router for any requests that start with '/api/v1/users'
// This is a best practice for versioning your API.
app.use("/api/v1/users", userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/lists', listRouter);
// The URL would look like: http://localhost:8000/api/v1/users/register


// Export the configured app instance
export { app };