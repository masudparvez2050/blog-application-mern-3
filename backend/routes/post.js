const express = require("express");
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  getUserPosts,
} = require("../controllers/postController");
const { auth, admin } = require("../middleware/auth");

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// User routes (requires authentication)
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.put("/:id/like", auth, likePost);
router.put("/:id/dislike", auth, dislikePost);
router.get("/user/posts", auth, getUserPosts);

module.exports = router;
