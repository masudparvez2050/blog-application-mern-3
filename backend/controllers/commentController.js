const Comment = require("../models/Comment");
const Post = require("../models/Post");
const mongoose = require("mongoose");

// @desc    Get all comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
exports.getCommentsByPostId = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      isActive: true,
      // Only return approved comments for public view
      isApproved: { $ne: false }, // Get approved and pending comments
    })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 })
      .exec();

    res.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all comments for admin (with filtering and pagination)
// @route   GET /api/comments/admin
// @access  Private/Admin
exports.getAdminComments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status || "all";

    // Build the filter query
    const filter = {};

    // Status filter
    if (status === "approved") {
      filter.isApproved = true;
    } else if (status === "pending") {
      filter.isApproved = null;
    } else if (status === "rejected") {
      filter.isApproved = false;
    } else if (status === "flagged") {
      filter.isFlagged = true;
    }

    // Search filter (search in content)
    if (search) {
      filter.content = { $regex: search, $options: "i" };
    }

    // Count total comments matching the filter
    const total = await Comment.countDocuments(filter);

    // Fetch comments with pagination
    const comments = await Comment.find(filter)
      .populate("author", "name profilePicture email")
      .populate("post", "title slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      comments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get admin comments error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a comment
// @route   POST /api/comments
// @access  Private
exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create comment
    const comment = new Comment({
      content,
      post: postId,
      author: req.user._id,
    });

    const createdComment = await comment.save();

    // Populate author info before returning
    await createdComment.populate("author", "name profilePicture");

    res.status(201).json(createdComment);
  } catch (error) {
    console.error("Create comment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private/Admin for approval/rejection
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // For admin approval/rejection
    if (req.user.role === "admin" && req.body.hasOwnProperty("isApproved")) {
      comment.isApproved = req.body.isApproved;
      const updatedComment = await comment.save();
      await updatedComment.populate("author", "name profilePicture");
      await updatedComment.populate("post", "title");
      return res.json(updatedComment);
    }

    // Regular comment update (content)
    // Check if user is the author of the comment
    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this comment" });
    }

    // Update content if provided
    if (req.body.content) {
      comment.content = req.body.content;
    }

    const updatedComment = await comment.save();
    await updatedComment.populate("author", "name profilePicture");

    res.json(updatedComment);
  } catch (error) {
    console.error("Update comment error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if user is the author of the comment or an admin
    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment removed" });
  } catch (error) {
    console.error("Delete comment error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Admin suspend a comment
// @route   PUT /api/comments/:id/suspend
// @access  Private/Admin
exports.suspendComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.isActive = false;

    await comment.save();

    res.json({ message: "Comment suspended" });
  } catch (error) {
    console.error("Suspend comment error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Flag a comment
// @route   PUT /api/comments/:id/flag
// @access  Private
exports.flagComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.isFlagged = true;
    await comment.save();

    res.json({ message: "Comment flagged for review" });
  } catch (error) {
    console.error("Flag comment error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
