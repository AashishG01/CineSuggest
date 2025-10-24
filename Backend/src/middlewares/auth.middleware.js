// import { ApiError } from "../utils/ApiError.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { User } from "../models/user.model.js";
// import jwt from "jsonwebtoken"



// export const verifyJWT = asyncHandler(async(req, _,next) =>{
//     try {
//         console.log(req.cookies)
//         const token = 
//         req.cookies?.accessToken || 
//         req.header("Authorization")?.replace("Bearer ", "")

//         console.log(token)

//         if(!token){
//             throw new ApiError(401, "Unauthorized request")
//         }

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

//         const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

//         if(!user){
//             throw new ApiError(401, "Invalid Access Token")
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         throw new ApiError(401, error?.message || "Invalid access token")
//     }
// })


import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    //console.log(`--- verifyJWT Middleware Running for: ${req.originalUrl} ---`);
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request: No token provided");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        // --- THIS IS THE FIX ---
        // Instead of just using the decoded payload, we fetch the full user from the DB.
        // This ensures the user exists and solves the id/_id mismatch.
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if (!user) {
            // This case handles if the user has been deleted but the token still exists.
            throw new ApiError(401, "Invalid Access Token: User not found");
        }
    
        // Attach the full Mongoose user object to the request.
        // Now, req.user will have req.user._id, req.user.username, etc.
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});