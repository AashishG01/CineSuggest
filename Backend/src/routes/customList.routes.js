import { Router } from "express";
import {
    createCustomList,
    getUserLists,
    getListDetails,
    addMovieToList,
    removeMovieFromList,
    deleteCustomList
} from "../controllers/customList.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All list routes require authentication
router.use(verifyJWT);

router.route("/")
    .post(createCustomList) // Create a new list
    .get(getUserLists);      // Get all lists for the user

router.route("/:listId")
    .get(getListDetails)     // Get details of one list
    .delete(deleteCustomList); // Delete a list

router.route("/:listId/add")
    .patch(addMovieToList);    // Add a movie to a list

router.route("/:listId/remove")
    .patch(removeMovieFromList); // Remove a movie from a list

export default router;