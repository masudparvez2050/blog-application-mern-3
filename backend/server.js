const express = require("express");
const cors = require("cors");
const { config } = require("dotenv");
const connectDB = require("./config/db");
const {
  jsonParsingMiddleware,
  requestLogger,
  globalErrorHandler,
} = require("./middleware/errorMiddleware");

// Load environment variables
config();

// Initialize Express app
const app = express();

// Configure CORS with options
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://blog-application-mern-3.vercel.app",
    "https://api-blog-application.vercel.app",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Add this line to allow credentials
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Request logger middleware
app.use(requestLogger);

// Custom JSON parsing middleware
app.use(jsonParsingMiddleware, express.json({ limit: "50mb" }));

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
const contactRoutes = require("./routes/contact"); // Add this line

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contact", contactRoutes); // Add this line

// Default route
app.get("/", (req, res) => {
  res.send("Blog API is running!");
});

// Global error handling middleware
app.use(globalErrorHandler);

// Set up the server port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
