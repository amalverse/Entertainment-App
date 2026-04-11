/**
 * WATCHED ROUTES
 *
 * This file defines all routes for managing the user's watched list (movies/TV shows).
 * All routes are protected - user must be logged in to access them.
 *
 * Base URL: /api/watched
 * Example: GET http://localhost:5000/api/watched
 */

const express = require("express");
const router = express.Router();

// Import authentication middleware (protects routes)
const protect = require("../middleware/authMiddleware");

// Import controller functions
const {
  getWatched,   // Get all watched items
  addWatched,   // Mark an item as watched
  removeWatched, // Remove an item from watched list
} = require("../controllers/watchedController");

/**
 * ASYNC ERROR HANDLER WRAPPER
 */
const asyncHandler = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error("Error:", err);
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

/**
 * GET /api/watched
 * Get all watched items for the logged-in user
 */
router.get("/", protect, asyncHandler(getWatched));

/**
 * POST /api/watched
 * Mark a new item as watched
 *
 * Body: { tmdbId, type, title, poster }
 */
router.post("/", protect, asyncHandler(addWatched));

/**
 * DELETE /api/watched/:id
 * Remove an item from the watched list (by subdocument _id)
 */
router.delete("/:id", protect, asyncHandler(removeWatched));

// Export router
module.exports = router;
