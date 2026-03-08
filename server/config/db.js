/**
 * DATABASE CONNECTION CONFIGURATION
 *
 * This file handles the connection to MongoDB database.
 * MongoDB is where we store all user data (accounts, bookmarks, etc.)
 */

const mongoose = require("mongoose");

/**
 * Connect to MongoDB Database
 *
 * This function establishes a connection to MongoDB using Mongoose.
 * Mongoose is an ODM (Object Data Modeling) library that makes it
 * easier to work with MongoDB in Node.js.
 *
 * @returns {Promise} - Resolves when connected, rejects on error
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using connection string from .env file
    // MONGO_URI looks like: mongodb://localhost:27017/entertainment-app
    // or for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname
    await mongoose.connect(process.env.MONGO_URI);

    // If successful, log success message
    console.log("✅ MongoDB Connected");
  } catch (error) {
    // If connection fails, log the error message
    console.error("❌ MongoDB Connection Error:", error.message);

    // Exit the application with error code 1
    // This stops the server because we can't run without a database
    process.exit(1);
  }
};

// Export the function so it can be used in index.js
module.exports = connectDB;
