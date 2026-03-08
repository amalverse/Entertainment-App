/**
 * BOOKMARK ROUTES
 *
 * This file defines all routes for managing user bookmarks (saved movies/TV shows).
 * All routes are protected - user must be logged in to access them.
 *
 * Base URL: /api/bookmarks
 * Example: GET http://localhost:5000/api/bookmarks
 */

const express = require("express");
const router = express.Router();

// Import authentication middleware (protects routes)
const protect = require("../middleware/authMiddleware");

// Import controller functions that handle the business logic
const {
  getBookmarks, // Get all user's bookmarks
  addBookmark, // Add a new bookmark
  removeBookmark, // Remove a bookmark
} = require("../controllers/bookmarkController");

/**
 * ASYNC ERROR HANDLER WRAPPER
 *
 * Automatically catches errors in async route handlers.
 * Prevents the need for try-catch blocks in every controller.
 *
 * @param {Function} fn - Async controller function
 * @returns {Function} - Wrapped function with error handling
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

/* ========================================
   ROUTE DEFINITIONS
   All routes require authentication (protect middleware)
   ======================================== */

/**
 * GET /api/bookmarks
 *
 * Get all bookmarks for the logged-in user
 *
 * Headers required:
 * Authorization: Bearer <token>
 *
 * Response:
 * {
 *   "bookmarks": [
 *     {
 *       "tmdbId": 550,
 *       "type": "movie",
 *       "title": "Fight Club",
 *       "poster": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
 *     }
 *   ]
 * }
 */
router.get("/", protect, asyncHandler(getBookmarks));

/**
 * POST /api/bookmarks
 *
 * Add a new bookmark to user's list
 *
 * Headers required:
 * Authorization: Bearer <token>
 *
 * Request body:
 * {
 *   "tmdbId": 550,
 *   "type": "movie",
 *   "title": "Fight Club",
 *   "poster": "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg"
 * }
 *
 * Response:
 * {
 *   "message": "Bookmark added successfully",
 *   "bookmarks": [...]
 * }
 */
router.post("/", protect, asyncHandler(addBookmark));

/**
 * DELETE /api/bookmarks/:id
 *
 * Remove a bookmark from user's list
 *
 * Headers required:
 * Authorization: Bearer <token>
 *
 * URL parameter:
 * - id: TMDB ID of the movie/show to remove
 *
 * Example: DELETE /api/bookmarks/550
 *
 * Response:
 * {
 *   "message": "Bookmark removed successfully",
 *   "bookmarks": [...]
 * }
 */
router.delete("/:id", protect, asyncHandler(removeBookmark));

// Export router to be used in index.js
module.exports = router;
