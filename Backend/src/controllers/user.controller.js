import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Watchlist } from "../models/watchlist.model.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @description Handles new user registration
 * @route POST /api/v1/users/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
        throw new ApiError(409, "User with this email or username already exists");
    }

    const user = await User.create({ username, email, password });

    // --- THIS IS THE NEW STEP ---
    // Create an associated empty watchlist for the new user.
    await Watchlist.create({ user: user._id });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

/**
 * @description Handles user login
 * @route POST /api/v1/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
    // 1. Get user details (username/email and password) from request body
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // 2. Find the user in the database
    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 3. Compare the provided password with the stored hashed password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // 4. Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // 5. Save the refresh token to the user's document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 6. Send tokens to the client via secure cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // Only use secure cookies in production
    };

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

/**
 * @description Handles user logout
 * @route POST /api/v1/users/logout
 * @access Private (requires authentication)
 */
const logoutUser = asyncHandler(async (req, res) => {
    // The `verifyJWT` middleware provides `req.user`
    // We remove the refresh token from the database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // This removes the field
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    // Clear the cookies on the client's browser
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// --- Watchlist Controllers ---

/**
 * @description Adds a movie to the user's watchlist
 * @route POST /api/v1/users/watchlist/add
 * @access Private
 */
const addToWatchlist = asyncHandler(async (req, res) => {
    // We now expect a movie object from the frontend
    const { movieId, title, posterPath, releaseYear } = req.body;
    const userId = req.user._id;

    if (!movieId) {
        throw new ApiError(400, "Movie ID is required");
    }

    // Find the user's watchlist document
    const watchlist = await Watchlist.findOne({ user: userId });

    if (!watchlist) {
        throw new ApiError(404, "Watchlist not found");
    }
    
    // Check if the movie already exists in the watchlist
    const movieExists = watchlist.movies.some(movie => movie.movieId === movieId);
    if (movieExists) {
        throw new ApiError(409, "Movie already in watchlist");
    }

    // Add the new movie object to the `movies` array
    watchlist.movies.push({ movieId, title, posterPath, releaseYear });

    // Save the updated watchlist document
    await watchlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, watchlist.movies, "Movie added to watchlist"));
});


/**
 * @description Removes a movie from the user's watchlist
 * @route POST /api/v1/users/watchlist/remove
 * @access Private
 */
const removeFromWatchlist = asyncHandler(async (req, res) => {
    const { movieId } = req.body;
    const userId = req.user._id;

    if (!movieId) {
        throw new ApiError(400, "Movie ID is required");
    }

    // Find the user's watchlist and remove the specific movie from the `movies` array
    const updatedWatchlist = await Watchlist.findOneAndUpdate(
        { user: userId },
        { $pull: { movies: { movieId: movieId } } }, // $pull removes an item from an array
        { new: true } // Return the updated document
    );

    if (!updatedWatchlist) {
        throw new ApiError(404, "Watchlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedWatchlist.movies, "Movie removed from watchlist"));
});

/**
 * @description Gets the user's entire watchlist
 * @route GET /api/v1/users/watchlist
 * @access Private
 */
const getWatchlist = asyncHandler(async (req, res) => {
    // Find the watchlist document associated with the logged-in user's ID
    const watchlist = await Watchlist.findOne({ user: req.user._id });

    if (!watchlist) {
        // This case might happen if the watchlist creation failed during registration
        throw new ApiError(404, "Watchlist not found for this user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, watchlist.movies, "Watchlist fetched successfully"));
});

// Recommendation 
// @desc    Get movie recommendations for the user
// @route   GET /api/v1/users/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // console.log("Fetching recommendations for User ID:", userId);

    // --- CORRECTED FETCH LOGIC ---
    // 2. Find the Watchlist document associated with the user ID
    const userWatchlist = await Watchlist.findOne({ user: userId });
    // --- ---

    // Log the fetched watchlist object
    //console.log("Fetched Watchlist object:", userWatchlist);

    // Handle cases where watchlist document or movies array is missing/empty
    if (!userWatchlist || !userWatchlist.movies || userWatchlist.movies.length === 0) {
        //console.log("Watchlist document not found or is empty.");
        return res.status(200).json(new ApiResponse(200, [], "Watchlist empty, cannot generate recommendations."));
    }

    // 3. Extract the array of movie IDs from the 'movies' field
    const watchlistIds = userWatchlist.movies.map(movie => movie.movieId); // Get just the IDs
    // --- ---

    //console.log("Extracted Watchlist IDs:", watchlistIds);

    // Call the Python Recommendation Service API
    try {
        //console.log(`Sending IDs to Python Service: ${watchlistIds}`);
        const recommendationResponse = await axios.post(
            `${process.env.RECOMMENDATION_API_URL}/recommend`,
            {
                imdb_ids: watchlistIds,
                top_n: 10
            }
        );

        const recommendedIds = recommendationResponse.data.recommended_imdb_ids || [];
        //console.log(`Received IDs from Python Service: ${recommendedIds}`);

        return res.status(200).json(
            new ApiResponse(200, recommendedIds, "Recommendations fetched successfully")
        );

    } catch (error) {
        console.error("Error calling recommendation service:", error.response?.data || error.message);
        throw new ApiError(500, "Could not fetch recommendations at this time.");
    }
});

// Export all controller functions
export {
    registerUser,
    loginUser,
    logoutUser,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
    getRecommendations,
};