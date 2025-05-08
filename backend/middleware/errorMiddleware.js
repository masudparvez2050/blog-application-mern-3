/**
 * Custom error handling middleware for the blog application
 */

// JSON parsing middleware to handle JSON parsing errors
const jsonParsingMiddleware = (req, res, next) => {
  // Skip this middleware for multipart/form-data requests
  const contentType = req.headers["content-type"] || "";
  if (contentType.includes("multipart/form-data")) {
    return next();
  }

  let data = "";

  req.on("data", (chunk) => {
    data += chunk;
  });

  req.on("end", () => {
    if (!data) {
      next();
      return;
    }

    try {
      if (data.trim()) {
        // Only try to parse if there's actual data
        req.body = JSON.parse(data);
      }
      next();
    } catch (e) {
      console.error("JSON Parse Error:", e.message);
      console.error(
        "Received data:",
        data.substring(0, 100) + (data.length > 100 ? "..." : "")
      );

      res.status(400).json({
        message: "Invalid JSON in request body",
        error: e.message,
        receivedData: data.substring(0, 50) + (data.length > 50 ? "..." : ""),
      });

      // Don't call next() when there's an error, to prevent further processing
    }
  });
};

// Request logger for debugging
const requestLogger = (req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request body type:", typeof req.body);
    // Don't log entire body for security, but log shape
    console.log("Request body keys:", Object.keys(req.body));
  }
  next();
};

// Global error handler
const globalErrorHandler = (err, req, res, next) => {
  console.error("Global error handler:", err.stack);

  // Check if headers have already been sent
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
};

module.exports = {
  jsonParsingMiddleware,
  requestLogger,
  globalErrorHandler,
};
