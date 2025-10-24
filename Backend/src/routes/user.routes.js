import { Router } from "express";
import {
    loginUser,
    registerUser,
    logoutUser,
    getWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    getRecommendations
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// --- Public Routes ---
// These routes do not require authentication
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);


// --- Private (Secured) Routes ---
// These routes require the user to be logged in.
// The `verifyJWT` middleware runs first to check for a valid token.
router.route("/logout").post(verifyJWT, logoutUser);

// Watchlist Routes
router.route("/watchlist").get(verifyJWT, getWatchlist);
router.route("/watchlist/add").post(verifyJWT, addToWatchlist);
router.route("/watchlist/remove").post(verifyJWT, removeFromWatchlist);
router.route("/recommendations").get(verifyJWT, getRecommendations);

export default router;