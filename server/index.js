/**
 * SERVER CONFIGURATION FILE
 *
 * This file sets up the Express server with all necessary middleware,
 * routes, and error handling. Think of this as the "brain" of your backend.
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
require("dotenv").config(); // Load environment variables from .env file

// Create Express application instance
const app = express();

// Connect to MongoDB database
connectDB();

/* ========================================
   MIDDLEWARE SETUP
   Middleware = functions that run BEFORE your route handlers
   They process requests before they reach your controllers
   ======================================== */

// CORS: Allow frontend (React) to make requests to this backend
// Without this, browsers block requests from different origins (ports)
app.use(cors());

// Parse incoming JSON data from request body
// Example: When user sends { "email": "test@test.com" }
app.use(express.json());

// Parse URL-encoded data (from HTML forms)
// Example: When form submits name=John&age=25
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (profile images) as static files
// This makes files in 'uploads' folder accessible via URL
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Development-only: Log all incoming requests to console
// Helps you see what requests are being made during development
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next(); // Pass control to next middleware
  });
}

/* ========================================
   API ROUTES
   Routes define what happens when someone visits a URL
   ======================================== */

// Health check endpoint - verify server is running
// Visit http://localhost:5000/ to see server status
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BingeHub.app API Server is running! 🚀",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      auth: "/api/auth (POST /register, /login, /verify-email)",
      bookmarks: "/api/bookmarks (GET, POST, DELETE)",
      user: "/api/user (GET /profile, PUT /profile, DELETE /profile)",
    },
  });
});

// Authentication routes: register, login, verify email
app.use("/api/auth", require("./routes/authRoutes"));

// Bookmark routes: save/remove favorite movies/shows
app.use("/api/bookmarks", require("./routes/bookmarkRoutes"));

// User profile routes: view/update/delete profile
app.use("/api/user", require("./routes/userRoutes"));

/* ========================================
   ERROR HANDLING
   These run AFTER all routes to catch errors
   ======================================== */

// 404 Handler: Catch requests to undefined routes
// If user visits /api/unknown, this sends a 404 error
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler: Catches all errors from routes/controllers
// This ensures errors are sent in a consistent format
app.use(require("./middleware/errorMiddleware"));

// Export the app so server.js can start it
module.exports = app;
