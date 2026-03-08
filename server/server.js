/**
 * SERVER STARTUP FILE
 *
 * This is the entry point of the backend application.
 * It starts the Express server and listens for incoming requests.
 *
 * Think of this as the "power button" that turns on your server.
 */

// Import the configured Express app from index.js
const app = require("./index");

// Get port number from environment variable or use 5000 as default
// Environment variables are set in the .env file
const PORT = process.env.PORT || 5000;

/**
 * START THE SERVER
 *
 * app.listen() tells the server to start listening for requests
 * on the specified port (5000 by default)
 *
 * When server starts successfully, it runs the callback function
 * which logs a success message to the console
 */
app.listen(PORT, () =>
  console.log(`✅ Server running on port http://localhost:${PORT}`),
);

// Export the app for testing purposes
module.exports = app;
