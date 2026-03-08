/**
 * Global error handling middleware.
 * Captures errors and sends a standardized JSON response.
 */
const errorMiddleware = (err, req, res, next) => {
  // Log error for server-side debugging
  console.error("Error:", err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json({
    message,
    status,
  });
};

module.exports = errorMiddleware;
