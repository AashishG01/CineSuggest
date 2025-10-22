import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { CustomList } from "../models/customList.model.js";

// @desc    Create a new custom list
// @route   POST /api/v1/lists
// @access  Private
const createCustomList = asyncHandler(async (req, res) => {
    const { listName, description } = req.body;
    const userId = req.user._id;

    if (!listName) {
        throw new ApiError(400, "List name is required");
    }

    // Check if list with same name already exists for this user
    const existingList = await CustomList.findOne({ user: userId, listName });
    if (existingList) {
        throw new ApiError(409, `List with name "${listName}" already exists.`);
    }

    const newList = await CustomList.create({
        user: userId,
        listName,
        description,
        movies: [], // Start with an empty list
    });

    return res.status(201).json(
        new ApiResponse(201, newList, "Custom list created successfully")
    );
});

// @desc    Get all custom lists for the logged-in user
// @route   GET /api/v1/lists
// @access  Private
const getUserLists = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    // Find lists, return only name, description, and ID (not the full movie array yet)
    const lists = await CustomList.find({ user: userId }).select("listName description createdAt");

    return res.status(200).json(
        new ApiResponse(200, lists, "User lists fetched successfully")
    );
});

// @desc    Get details of a specific custom list (including movies)
// @route   GET /api/v1/lists/:listId
// @access  Private
const getListDetails = asyncHandler(async (req, res) => {
    const { listId } = req.params;
    const userId = req.user._id;

    const list = await CustomList.findOne({ _id: listId, user: userId });

    if (!list) {
        throw new ApiError(404, "List not found or you don't have permission to view it.");
    }

    return res.status(200).json(
        new ApiResponse(200, list, "List details fetched successfully")
    );
});


// @desc    Add a movie to a specific custom list
// @route   PATCH /api/v1/lists/:listId/add
// @access  Private
const addMovieToList = asyncHandler(async (req, res) => {
    const { listId } = req.params;
    const { movieId, title, posterPath, releaseYear } = req.body; // Expect full movie object
    const userId = req.user._id;

    if (!movieId) throw new ApiError(400, "Movie ID is required");

    const list = await CustomList.findOne({ _id: listId, user: userId });

    if (!list) throw new ApiError(404, "List not found or permission denied.");

    // Check if movie already exists in the list
    const movieExists = list.movies.some(m => m.movieId === movieId);
    if (movieExists) throw new ApiError(409, "Movie already in this list.");

    list.movies.push({ movieId, title, posterPath, releaseYear });
    await list.save();

    return res.status(200).json(
        new ApiResponse(200, list, "Movie added to list")
    );
});

// @desc    Remove a movie from a specific custom list
// @route   PATCH /api/v1/lists/:listId/remove
// @access  Private
const removeMovieFromList = asyncHandler(async (req, res) => {
    const { listId } = req.params;
    const { movieId } = req.body; // Only need movieId to remove
    const userId = req.user._id;

    if (!movieId) throw new ApiError(400, "Movie ID is required");

    const list = await CustomList.findOneAndUpdate(
        { _id: listId, user: userId },
        { $pull: { movies: { movieId: movieId } } }, // Use $pull to remove item from array
        { new: true }
    );

     if (!list) throw new ApiError(404, "List not found or permission denied.");

    return res.status(200).json(
        new ApiResponse(200, list, "Movie removed from list")
    );
});

// @desc    Delete a custom list
// @route   DELETE /api/v1/lists/:listId
// @access  Private
const deleteCustomList = asyncHandler(async (req, res) => {
    const { listId } = req.params;
    const userId = req.user._id;

    const result = await CustomList.deleteOne({ _id: listId, user: userId });

    if (result.deletedCount === 0) {
         throw new ApiError(404, "List not found or permission denied.");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "List deleted successfully")
    );
});


export {
    createCustomList,
    getUserLists,
    getListDetails,
    addMovieToList,
    removeMovieFromList,
    deleteCustomList
};