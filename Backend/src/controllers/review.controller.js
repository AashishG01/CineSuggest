import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";

// @desc    Create a new review
// @route   POST /api/v1/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
    const { movieId, rating, comment } = req.body;
    const { _id: userId, username } = req.user;

    // Check if user has already reviewed this movie
    const existingReview = await Review.findOne({ movieId, user: userId });
    if (existingReview) {
        throw new ApiError(409, "You have already reviewed this movie.");
    }

    const review = await Review.create({
        movieId,
        rating,
        comment,
        user: userId,
        username: username,
    });

    return res.status(201).json(
        new ApiResponse(201, review, "Review added successfully")
    );
});

// @desc    Get all reviews for a movie
// @route   GET /api/v1/reviews/:movieId
// @access  Public
const getReviewsForMovie = asyncHandler(async (req, res) => {
    const { movieId } = req.params;
    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 }); // Newest first

    return res.status(200).json(
        new ApiResponse(200, reviews, "Reviews fetched successfully")
    );
});

// @desc    Delete a user's own review
// @route   DELETE /api/v1/reviews/:reviewId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Security check: Ensure the user deleting the review is the one who created it
    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review");
    }

    await review.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, {}, "Review deleted successfully")
    );
});

const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Security check: Ensure the user editing the review is the one who created it
    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to edit this review");
    }

    // Update the fields and save the document
    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;

    await review.save();

    return res.status(200).json(
        new ApiResponse(200, review, "Review updated successfully")
    );
});


export { createReview, getReviewsForMovie, deleteReview, updateReview };