import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        movieId: {
            type: String, // The IMDb ID of the movie
            required: true,
            index: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        username: {
            type: String, // Store the username for easy display on the frontend
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5, // A 1-5 star rating system
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        }
    },
    {
        timestamps: true // Adds createdAt and updatedAt timestamps
    }
);

export const Review = mongoose.model("Review", reviewSchema);