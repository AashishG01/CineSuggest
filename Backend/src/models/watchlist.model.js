import mongoose, { Schema } from "mongoose";

// Define the structure for a Watchlist document
const watchlistSchema = new Schema(
    {
        // A reference to the User who owns this watchlist. This is the link between the two models.
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        // An array of movie objects
        movies: [
            {
                // The unique ID from the external movie API (e.g., TMDB or OMDb)
                movieId: {
                    type: String,
                    required: true,
                },
                title: {
                    type: String,
                    required: true,
                },
                posterPath: {
                    type: String, // The path to the movie poster image
                },
                releaseYear: {
                    type: String,
                },
                addedAt: {
                    type: Date,
                    default: Date.now,
                }
            }
        ]
    }, 
    {
        timestamps: true // Automatically adds `createdAt` and `updatedAt` for the list itself
    }
);

export const Watchlist = mongoose.model("Watchlist", watchlistSchema);