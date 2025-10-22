import mongoose, { Schema } from "mongoose";

const customListSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        listName: {
            type: String,
            required: true,
            trim: true,
        },
        description: { // Optional description for the list
            type: String,
            trim: true,
        },
        movies: [ // Array of movie objects stored in this list
            {
                movieId: { type: String, required: true }, // IMDb ID
                title: { type: String },
                posterPath: { type: String },
                releaseYear: { type: String },
                addedAt: { type: Date, default: Date.now }
            }
        ]
    },
    {
        timestamps: true
    }
);

// Prevent a user from having multiple lists with the same name
customListSchema.index({ user: 1, listName: 1 }, { unique: true });

export const CustomList = mongoose.model("CustomList", customListSchema);