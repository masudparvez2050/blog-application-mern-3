const express = require("express");
const router = express.Router();
const {
  getCommentsByPostId,
  createComment,
  updateComment,
  deleteComment,
  suspendComment,
  getAdminComments,
  flagComment,
} = require("../controllers/commentController");
const { auth, admin } = require("../middleware/auth");

// Public routes
router.get("/post/:postId", getCommentsByPostId);

// User routes (requires authentication)
router.post("/", auth, createComment);
router.put("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);
router.put("/:id/flag", auth, flagComment);

// Admin routes
router.get("/admin", auth, admin, getAdminComments);
router.put("/:id/suspend", auth, admin, suspendComment);

module.exports = router;
