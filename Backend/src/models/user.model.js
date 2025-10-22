import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Define the structure for the User document
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true // Makes this field searchable and optimized in the database
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        avatar: {
            type: String, // URL from a service like Cloudinary
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// Mongoose "pre-save" hook: This function runs just before a user document is saved.
// We use it to securely hash the password.
userSchema.pre("save", async function (next) {
    // Only hash the password if it has been modified (or is new)
    if(!this.isModified("password")) return next();

    // Hash the password with a salt factor of 10
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Custom method to compare an incoming password with the stored hashed password
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

// Custom method to generate a short-lived JWT Access Token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

// Custom method to generate a long-lived JWT Refresh Token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
}

export const User = mongoose.model("User", userSchema);