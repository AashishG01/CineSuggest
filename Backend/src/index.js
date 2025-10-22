// This should be the very first line to ensure environment variables are loaded
// before any other code is executed.
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Configure dotenv to load variables from the .env file in the root directory
dotenv.config({
    path: './.env'
});

// connectDB() returns a promise, so we handle it with .then() and .catch()
connectDB()
.then(() => {
    // This is an optional but good practice listener for the app itself.
    // It catches any errors that the Express app might encounter before the server starts listening.
    app.on("error", (error) => {
        console.error("Express App Error: ", error);
        throw error;
    });

    // Start the server and make it listen for requests on the specified port.
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️  Server is running at port: ${process.env.PORT || 8000}`);
    });
})
.catch((err) => {
    // If the database connection fails, this block will execute.
    console.log("MONGO db connection failed !!! ", err);
});