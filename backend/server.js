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

// JSON parsing with error handling
app.use(
  express.json({
    limit: "50mb",
    verify: (req, res, buf, encoding) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({
          message: "Invalid JSON in request body",
          error: e.message,
          // Help debugging by showing beginning of body
          receivedData: buf.toString().substring(0, 50) + "...",
        });
        throw e;
      }
    },
  })
);
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
  console.error(err.stack);
  res
    .status(500)
    .send({ message: "Something went wrong!", error: err.message });
});

// Set up the server port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
