const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tag, search } = req.query;
    const query = { status: "published", isActive: true };

    if (category) {
      query.categories = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name profilePicture bio")
      .exec();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error("Get post by ID error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, categories, tags, status } = req.body;
    let coverImage = req.body.coverImage;

    // Upload to cloudinary if image is provided as base64
    let imageData = { url: "", publicId: "" };
    if (coverImage && coverImage.startsWith("data:")) {
      imageData = await uploadImage(coverImage, "blog/covers");
      coverImage = imageData.url;
    }

    const post = new Post({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150) + "...",
      coverImage: imageData.url,
      coverImagePublicId: imageData.publicId,
      author: req.user._id,
      categories: categories || [],
      tags: tags || [],
      status: status || "draft",
    });

    const createdPost = await post.save();

    res.status(201).json(createdPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    const { title, content, excerpt, categories, tags, status } = req.body;
    let coverImage = req.body.coverImage;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    // Handle image update
    let imageData = { url: post.coverImage, publicId: post.coverImagePublicId };

    // If a new image is provided as base64, upload it and delete old one
    if (
      coverImage &&
      coverImage.startsWith("data:") &&
      coverImage !== post.coverImage
    ) {
      // Delete old image if it exists
      if (post.coverImagePublicId) {
        await deleteImage(post.coverImagePublicId);
      }

      // Upload new image
      imageData = await uploadImage(coverImage, "blog/covers");
      coverImage = imageData.url;
    }
    // If image is explicitly removed
    else if (coverImage === null || coverImage === "") {
      // Delete the existing image from cloudinary
      if (post.coverImagePublicId) {
        await deleteImage(post.coverImagePublicId);
      }
      imageData = { url: "", publicId: "" };
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.excerpt = excerpt || post.excerpt;
    post.coverImage = imageData.url;
    post.coverImagePublicId = imageData.publicId;
    post.categories = categories || post.categories;
    post.tags = tags || post.tags;
    post.status = status || post.status;

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    console.error("Update post error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user is the author or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete the image from Cloudinary if it exists
    if (post.coverImagePublicId) {
      await deleteImage(post.coverImagePublicId);
    }

    // Delete post and its comments
    await Comment.deleteMany({ post: req.params.id });
    await post.deleteOne();

    res.json({ message: "Post removed" });
  } catch (error) {
    console.error("Delete post error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Like a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post has already been liked by this user
    if (post.likes.includes(req.user._id)) {
      // User already liked the post, so remove the like
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      // Add like and remove from dislikes if present
      post.likes.push(req.user._id);
      post.dislikes = post.dislikes.filter(
        (dislike) => dislike.toString() !== req.user._id.toString()
      );
    }

    await post.save();

    res.json({ likes: post.likes, dislikes: post.dislikes });
  } catch (error) {
    console.error("Like post error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Dislike a post
// @route   PUT /api/posts/:id/dislike
// @access  Private
exports.dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post has already been disliked by this user
    if (post.dislikes.includes(req.user._id)) {
      // User already disliked the post, so remove the dislike
      post.dislikes = post.dislikes.filter(
        (dislike) => dislike.toString() !== req.user._id.toString()
      );
    } else {
      // Add dislike and remove from likes if present
      post.dislikes.push(req.user._id);
      post.likes = post.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    }

    await post.save();

    res.json({ likes: post.likes, dislikes: post.dislikes });
  } catch (error) {
    console.error("Dislike post error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all posts by current user
// @route   GET /api/posts/user
// @access  Private
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .exec();

    res.json(posts);
  } catch (error) {
    console.error("Get user posts error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
