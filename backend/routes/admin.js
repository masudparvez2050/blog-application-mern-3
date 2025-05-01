const express = require("express");
const router = express.Router();
const { auth, admin } = require("../middleware/auth");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

// Admin Dashboard
router.get("/dashboard", auth, admin, (req, res) => {
  // Admin dashboard metrics logic
  res.status(200).json({ message: "Admin dashboard data" });
});

// Admin User Management
router.get("/users", auth, admin, userController.getAllUsers);
router.get("/users/:id", auth, admin, userController.getUserById);
router.put("/users/:id", auth, admin, userController.updateUser);
router.delete("/users/:id", auth, admin, userController.deleteUser);
router.put("/users/:id/activate", auth, admin, async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = true;
    await user.save();

    res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/users/:id/deactivate", auth, admin, async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/users/:id/role", auth, admin, async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle admin role
    const makeAdmin = req.body.role === "admin" || req.body.isAdmin === true;
    user.isAdmin = makeAdmin;
    await user.save();

    res.status(200).json({
      message: `User ${
        makeAdmin ? "promoted to admin" : "demoted from admin"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Post Management
router.get("/posts", auth, admin, postController.getAllPosts);
router.get("/posts/:id", auth, admin, postController.getPostById);
router.delete("/posts/:id", auth, admin, postController.deletePost);
router.put("/posts/:id/status", auth, admin, async (req, res) => {
  try {
    const post = await require("../models/Post").findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = req.body.status;
    await post.save();

    res.status(200).json({ message: `Post ${req.body.status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put("/posts/:id/feature", auth, admin, async (req, res) => {
  try {
    const post = await require("../models/Post").findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.isFeatured = req.body.isFeatured;
    await post.save();

    res.status(200).json({
      message: `Post ${
        req.body.isFeatured ? "featured" : "unfeatured"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Comment Management
router.get("/comments", auth, admin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status;

    let query = {};
    if (search) {
      query.content = { $regex: search, $options: "i" };
    }
    if (status && status !== "all") {
      query.isApproved = status === "approved";
    }

    const Comment = require("../models/Comment");
    const comments = await Comment.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("post", "title");

    const totalComments = await Comment.countDocuments(query);

    res.status(200).json({
      comments,
      totalPages: Math.ceil(totalComments / limit),
      currentPage: page,
      totalComments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/comments/:id", auth, admin, async (req, res) => {
  try {
    const comment = await require("../models/Comment").findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await comment.remove();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/comments/:id/status", auth, admin, async (req, res) => {
  try {
    const comment = await require("../models/Comment").findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.isApproved = req.body.status === "approve";
    await comment.save();

    res.status(200).json({
      message: `Comment ${
        comment.isApproved ? "approved" : "rejected"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
