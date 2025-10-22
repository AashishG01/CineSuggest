import { Router } from "express";
import { createReview, getReviewsForMovie, deleteReview, updateReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Define the routes
router.route("/")
    .post(verifyJWT, createReview); // Logged-in users can create a review

router.route("/:movieId")
    .get(getReviewsForMovie); // Anyone can get reviews for a movie

router.route("/:reviewId")
    .delete(verifyJWT, deleteReview) // Logged-in users can delete their own review
    .patch(verifyJWT, updateReview);

export default router;