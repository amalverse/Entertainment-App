const express = require("express");
const router = express.Router();

// Import controller functions that handle the business logic
const {
  registerUser, // Handles user registration
  loginUser, // Handles user login
  verifyEmail, // Handles email verification
  googleLogin, // Handles Google OAuth (simplified - no Passport!)
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

/**
 * ASYNC ERROR HANDLER WRAPPER
 *
 * This wrapper catches errors in async route handlers automatically.
 * Without this, you'd need try-catch blocks in every controller.
 *
 * How it works:
 * 1. Wraps the controller function
 * 2. Tries to execute it
 * 3. If error occurs, catches it and sends error response
 *
 * @param {Function} fn - Async controller function
 * @returns {Function} - Wrapped function with error handling
 */
const asyncHandler = (fn) => async (req, res) => {
  try {
    // Execute the controller function
    await fn(req, res);
  } catch (err) {
    // If error occurs, log it and send error response
    console.error("Error:", err);
    res.status(err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

/* ========================================
   ROUTE DEFINITIONS
   ======================================== */

/**
 * POST /api/auth/register
 *
 * Register a new user account
 *
 * Request body:
 * {
 *   "username": "john_doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 *
 * Response:
 * {
 *   "message": "Registration successful! Please check your email to verify your account."
 * }
 */
router.post("/register", asyncHandler(registerUser));

/**
 * POST /api/auth/login
 *
 * Login with existing account
 *
 * Request body:
 * {
 *   "email": "john@example.com",
 *   "password": "securePassword123"
 * }
 *
 * Response:
 * {
 *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *   "user": {
 *     "_id": "507f1f77bcf86cd799439011",
 *     "username": "john_doe",
 *     "email": "john@example.com"
 *   }
 * }
 */
router.post("/login", asyncHandler(loginUser));

/**
 * GET /api/auth/verify/:token
 *
 * Verify user's email address using token from verification email
 *
 * URL parameter:
 * - token: Verification token sent in email
 *
 * Example: GET /api/auth/verify/abc123xyz456
 *
 * Response:
 * {
 *   "message": "Email verified successfully! You can now log in."
 * }
 */
router.get("/verify/:token", asyncHandler(verifyEmail));

/**
 * POST /api/auth/forgot-password
 *
 * Request a password reset link
 *
 * Request body:
 * { "email": "user@example.com" }
 */
router.post("/forgot-password", asyncHandler(forgotPassword));

/**
 * POST /api/auth/reset-password/:token
 *
 * Reset password using token
 *
 * Request body:
 * { "password": "newPassword123" }
 */
router.post("/reset-password/:token", asyncHandler(resetPassword));

/* ========================================
   GOOGLE OAUTH ROUTE (SIMPLIFIED!)
   ======================================== */

/**
 * POST /api/auth/google
 *
 * Handle Google OAuth login
 * Frontend sends the authorization code, backend exchanges it for user info
 *
 * Request body:
 * {
 *   "code": "authorization_code_from_google"
 * }
 *
 * Response:
 * {
 *   "user": { ... },
 *   "token": "jwt_token"
 * }
 */
router.post("/google", asyncHandler(googleLogin));

// Export router to be used in index.js
module.exports = router;
