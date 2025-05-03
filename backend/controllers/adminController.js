const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Category = require("../models/Category");
const bcrypt = require("bcryptjs");

// Admin Dashboard
exports.getDashboard = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total posts count
    const totalPosts = await Post.countDocuments();

    // Get pending posts count (posts with status "draft" or "pending")
    const pendingPosts = await Post.countDocuments({
      status: { $in: ["draft", "pending"] },
    });

    // Get total comments count
    const totalComments = await Comment.countDocuments();

    // Get pending comments count (comments not yet approved)
    const pendingComments = await Comment.countDocuments({
      isApproved: false,
    });

    // Get recent activity (last 10 posts and comments)
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title author status createdAt")
      .populate("author", "name");

    const recentComments = await Comment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("content author post createdAt")
      .populate("author", "name")
      .populate("post", "title");

    // Combine and sort activities by date
    const recentActivity = [
      ...recentPosts.map((post) => ({
        type: "post",
        id: post._id,
        title: post.title,
        user: post.author.name,
        date: post.createdAt,
        status: post.status,
      })),
      ...recentComments.map((comment) => ({
        type: "comment",
        id: comment._id,
        content: comment.content.substring(0, 100),
        user: comment.author.name,
        post: comment.post.title,
        date: comment.createdAt,
        isApproved: comment.isApproved,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    // Return dashboard stats
    res.status(200).json({
      totalUsers,
      totalPosts,
      totalComments,
      pendingPosts,
      pendingComments,
      recentActivity,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin User Management
exports.getUsers = async (req, res) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || "createdAt";
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
    const search = req.query.search || "";

    // Build the query
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { role: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Create sort object
    const sort = {};
    sort[sortField] = sortDirection;

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Get users with pagination and sorting
    const users = await User.find(query)
      .select("-password") // Exclude password from results
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Count total users matching query
    const total = await User.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(total / limit);

    // Send response
    res.status(200).json({
      users,
      totalUsers: total,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Admin get users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, isActive, isVerified } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Will be hashed by the pre-save hook in User model
      role: role || "user",
      isActive: isActive !== undefined ? isActive : true,
      isVerified: isVerified !== undefined ? isVerified : false,
    });

    // Save the user
    const savedUser = await newUser.save();

    // Return the user without the password
    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        isActive: savedUser.isActive,
        isVerified: savedUser.isVerified,
      },
    });
  } catch (error) {
    console.error("Admin create user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = true;
    await user.save();

    res.status(200).json({ message: "User activated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isActive = false;
    await user.save();

    res.status(200).json({ message: "User deactivated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update the role field directly instead of isAdmin
    const newRole = req.body.role === "admin" ? "admin" : "user";
    user.role = newRole;

    await user.save();

    res.status(200).json({
      message: `User role updated to ${newRole} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Post Status Management
exports.updatePostStatus = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.status = req.body.status;
    await post.save();

    res.status(200).json({ message: `Post ${req.body.status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePostFeature = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
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
};

// Comment Management
exports.getComments = async (req, res) => {
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
      if (status === "approved") {
        query.isApproved = true;
      } else if (status === "rejected") {
        query.isApproved = false;
      } else if (status === "pending") {
        query.isApproved = null;
      } else if (status === "flagged") {
        query.isFlagged = true;
      }
    }

    const comments = await Comment.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author", "name email")
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
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCommentStatus = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.isApproved = req.body.isApproved;
    await comment.save();

    res.status(200).json({
      message: `Comment ${
        comment.isApproved ? "approved" : "rejected"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const timeRange = req.query.timeRange || "month"; // Default to month if not specified

    // Calculate date ranges based on timeRange
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case "year":
        startDate = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        break;
      case "quarter":
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        break;
      default: // month
        startDate = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
    }

    // Total counts
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalViews = await Post.aggregate([
      { $group: { _id: null, totalViews: { $sum: "$views" } } },
    ]);
    const totalLikes = await Post.aggregate([
      {
        $project: {
          likes: { $ifNull: ["$likes", []] },
        },
      },
      { $group: { _id: null, totalLikes: { $sum: { $size: "$likes" } } } },
    ]);

    // Posts per month data
    const postsPerMonth = await Post.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "/",
              { $toString: "$_id.year" },
            ],
          },
          count: 1,
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Comments per month data
    const commentsPerMonth = await Comment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "/",
              { $toString: "$_id.year" },
            ],
          },
          count: 1,
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Users per month data
    const usersPerMonth = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "/",
              { $toString: "$_id.year" },
            ],
          },
          count: 1,
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Views per month based on post creation date and views
    const viewsPerMonth = await Post.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: "$views" },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "/",
              { $toString: "$_id.year" },
            ],
          },
          count: 1,
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Likes per month based on post creation date and likes
    const likesPerMonth = await Post.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $project: {
          createdAt: 1,
          likes: { $ifNull: ["$likes", []] },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: { $size: "$likes" } },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.month" },
              "/",
              { $toString: "$_id.year" },
            ],
          },
          count: 1,
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Top performing posts
    const topPosts = await Post.aggregate([
      { $match: { status: "published" } },
      {
        $project: {
          title: 1,
          views: 1,
          likes: { $ifNull: ["$likes", []] },
          comments: { $ifNull: ["$comments", []] },
          createdAt: 1,
          score: {
            $add: [
              { $ifNull: ["$views", 0] },
              { $multiply: [{ $size: { $ifNull: ["$likes", []] } }, 5] },
              { $multiply: [{ $size: { $ifNull: ["$comments", []] } }, 3] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 5 },
    ]);

    // Category stats with percentages
    const categories = await Category.find();

    // Calculate total posts count for percentage calculation
    const postsByCategory = await Post.aggregate([
      { $group: { _id: "$category", postCount: { $sum: 1 } } },
    ]);

    // Calculate total views by category
    const viewsByCategory = await Post.aggregate([
      { $group: { _id: "$category", viewCount: { $sum: "$views" } } },
    ]);

    // Calculate total likes by category
    const likesByCategory = await Post.aggregate([
      {
        $project: {
          category: 1,
          likes: { $ifNull: ["$likes", []] },
        },
      },
      {
        $group: { _id: "$category", likeCount: { $sum: { $size: "$likes" } } },
      },
    ]);

    const totalPostsCount = await Post.countDocuments();

    // Build category statistics with percentages
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const postStats = postsByCategory.find(
          (p) => p._id && p._id.toString() === category._id.toString()
        ) || { postCount: 0 };
        const viewStats = viewsByCategory.find(
          (v) => v._id && v._id.toString() === category._id.toString()
        ) || { viewCount: 0 };
        const likeStats = likesByCategory.find(
          (l) => l._id && l._id.toString() === category._id.toString()
        ) || { likeCount: 0 };

        return {
          _id: category._id,
          name: category.name,
          postCount: postStats.postCount,
          viewCount: viewStats.viewCount,
          likeCount: likeStats.likeCount,
          percentage: (postStats.postCount / totalPostsCount) * 100 || 0,
        };
      })
    );

    // Sort categories by post count
    categoryStats.sort((a, b) => b.postCount - a.postCount);

    res.status(200).json({
      totalUsers,
      totalPosts,
      totalViews: totalViews.length > 0 ? totalViews[0].totalViews : 0,
      totalLikes: totalLikes.length > 0 ? totalLikes[0].totalLikes : 0,
      postsPerMonth,
      commentsPerMonth,
      usersPerMonth,
      viewsPerMonth,
      likesPerMonth,
      topPosts,
      categoryStats,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
