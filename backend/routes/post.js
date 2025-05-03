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
  getPostsByUserId,
  getPostsWithComments,
  getSimilarPosts,
  getLikeStatus,
} = require("../controllers/postController");
const { auth, admin } = require("../middleware/auth");

// Public routes
router.get("/", getAllPosts);
router.get("/with-comments", getPostsWithComments);
router.get("/:id/similar", getSimilarPosts); // New route for similar posts
router.get("/:id", getPostById);

// User routes (requires authentication)
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

// Like/Dislike routes
router.put("/:id/like", auth, likePost);
router.put("/:id/dislike", auth, dislikePost);
router.get("/:id/like-status", auth, getLikeStatus);

router.get("/user/posts", auth, getUserPosts);
router.get("/user/:userId", auth, getPostsByUserId);

module.exports = router;
