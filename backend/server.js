const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("Request body type:", typeof req.body);
    // Don't log entire body for security, but log shape
    console.log("Request body keys:", Object.keys(req.body));
  }
  next();
});

// Custom JSON parsing error handler
app.use((req, res, next) => {
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
}, express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Connect to MongoDB
connectDB();

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");
const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/category");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Blog API is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Global error handler:", err.stack);

  // Check if headers have already been sent
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    message: "Something went wrong!",
    error: err.message,
  });
});

// Set up the server port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
