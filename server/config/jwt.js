/**
 * JWT TOKEN GENERATOR
 *
 * JWT (JSON Web Token) is used for user authentication.
 * Think of it as a "digital ID card" that proves a user is logged in.
 *
 * How it works:
 * 1. User logs in with email/password
 * 2. Server verifies credentials
 * 3. Server creates a JWT token containing user ID
 * 4. User stores token (in localStorage)
 * 5. User sends token with every request
 * 6. Server verifies token to identify the user
 */

const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 *
 * Creates a signed token that contains the user's ID.
 * This token is sent to the client after successful login.
 *
 * @param {string} id - The user's MongoDB _id
 * @returns {string} - Signed JWT token
 *
 * Example:
 * const token = generateToken("507f1f77bcf86cd799439011");
 * // Returns: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload: Data to encode in the token
    process.env.JWT_SECRET, // Secret key: Used to sign the token (from .env)
    {
      expiresIn: "7d", // Token expires in 7 days (user must login again after)
    },
  );
};

// Export the function to use in controllers
module.exports = generateToken;
