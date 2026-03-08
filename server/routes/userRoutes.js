/**
 * USER PROFILE ROUTES
 *
 * This file defines all routes for managing user profiles.
 * All routes are protected - user must be logged in to access them.
 *
 * Base URL: /api/user
 * Example: GET http://localhost:5000/api/user/profile
 */

const express = require("express");
const router = express.Router();

// Import middleware
const protect = require("../middleware/authMiddleware"); // Authentication
const upload = require("../middleware/uploadMiddleware"); // File upload (Multer)

// Import controller functions that handle the business logic
const {
  getUserProfile, // Get user's profile data
  updateUserProfile, // Update user's profile (including image upload)
  deleteUserProfile, // Delete user's account
} = require("../controllers/userController");

/**
 * ASYNC ERROR HANDLER WRAPPER
 *
 * Automatically catches errors in async route handlers.
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
   Using .route() to chain multiple methods on same path
   ======================================== */

/**
 * /api/user/profile
 *
 * This demonstrates Express route chaining - multiple HTTP methods on one path
 */
router
  .route("/profile")

  /**
   * GET /api/user/profile
   *
   * Get the logged-in user's profile information
   *
   * Headers required:
   * Authorization: Bearer <token>
   *
   * Response:
   * {
   *   "_id": "507f1f77bcf86cd799439011",
   *   "username": "john_doe",
   *   "email": "john@example.com",
   *   "profileImage": "/uploads/profileImage-1234567890-123456789.jpg",
   *   "bookmarks": [...]
   * }
   */
  .get(protect, asyncHandler(getUserProfile))

  /**
   * PUT /api/user/profile
   *
   * Update user's profile (username, email, password, profile image)
   *
   * Headers required:
   * Authorization: Bearer <token>
   * Content-Type: multipart/form-data (for file upload)
   *
   * Middleware chain:
   * 1. protect - Verify user is logged in
   * 2. upload.single("profileImage") - Handle file upload
   * 3. updateUserProfile - Process the update
   *
   * Request body (form-data):
   * - username: "new_username" (optional)
   * - email: "new@email.com" (optional)
   * - password: "newPassword123" (optional)
   * - profileImage: <file> (optional)
   *
   * Response:
   * {
   *   "_id": "507f1f77bcf86cd799439011",
   *   "username": "new_username",
   *   "email": "new@email.com",
   *   "profileImage": "/uploads/profileImage-1234567890-123456789.jpg"
   * }
   */
  .put(protect, upload.single("profileImage"), asyncHandler(updateUserProfile))

  /**
   * DELETE /api/user/profile
   *
   * Delete the user's account permanently
   * This removes all user data including bookmarks
   *
   * Headers required:
   * Authorization: Bearer <token>
   *
   * Response:
   * {
   *   "message": "User account deleted successfully"
   * }
   */
  .delete(protect, asyncHandler(deleteUserProfile));

// Export router to be used in index.js
module.exports = router;
