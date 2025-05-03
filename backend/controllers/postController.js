const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const { uploadImage, deleteImage } = require("../utils/cloudinary");

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
      sort = "createdAt",
      sortField,
      sortDirection,
      status,
      isFeatured,
    } = req.query;

    // Check if this is an admin request (has auth token) or public request
    const isAdminRequest = req.user && req.user.role === "admin";

    // Set up the initial query
    let query = {};

    // If this is a public request, only show published and active posts
    if (!isAdminRequest) {
      query.status = "published";
      query.isActive = true;
    }
    // If this is an admin request and a status filter is provided
    else if (isAdminRequest && status && status !== "all") {
      query.status = status;
    }

    if (category) {
      query.categories = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      // Enhanced search with regex for better multi-word searching
      const searchRegex = new RegExp(search.split(" ").join("|"), "i");
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { excerpt: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];

      // If MongoDB text index search is preferred, keep this as an alternative
      // query.$text = { $search: search };
    }

    // Add filter for featured posts if isFeatured parameter is provided
    if (isFeatured === "true") {
      query.isFeatured = true;
    }

    // Determine sort order
    const sortOption = {};
    // For admin requests, use the sortField and sortDirection if provided
    if (isAdminRequest && sortField) {
      sortOption[sortField] = sortDirection === "asc" ? 1 : -1;
    }
    // For public requests or as fallback
    else if (sort === "views") {
      sortOption.views = -1;
    } else if (sort === "createdAt") {
      sortOption.createdAt = -1;
    } else {
      sortOption[sort] = -1;
    }

    const posts = await Post.find(query)
      .populate("author", "name profilePicture")
      .populate("categories", "name slug") // Populate categories with name and slug
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Post.countDocuments(query);

    // Get comment counts for each post
    const postsWithCommentCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({
          post: post._id,
          isActive: true,
          isApproved: { $ne: false },
        });

        // Convert to plain object and add comment count
        const postObj = post.toObject();
        postObj.commentCount = commentCount;

        return postObj;
      })
    );

    res.json({
      posts: postsWithCommentCounts,
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
      .populate("categories", "name slug") // Populate categories with name and slug
      .exec();

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch comments for this post
    const comments = await Comment.find({
      post: req.params.id,
      isActive: true,
      isApproved: { $ne: false }, // Get approved and pending comments
    })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 })
      .exec();

    // Increment view count
    post.views += 1;
    await post.save();

    // Create a response object with post and its comments
    const postWithComments = {
      ...post._doc,
      comments,
    };

    res.json(postWithComments);
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
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already liked this post
    const alreadyLiked = post.likes.includes(userId);

    // Check if user previously disliked this post
    const alreadyDisliked = post.dislikes.includes(userId);

    // If user already liked the post, remove the like (toggle behavior)
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
      return res.status(200).json({
        message: "Like removed",
        likes: post.likes.length,
        dislikes: post.dislikes.length,
        userAction: "none",
      });
    }

    // If user previously disliked, remove the dislike
    if (alreadyDisliked) {
      post.dislikes = post.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // Add the like
    post.likes.push(userId);
    await post.save();

    res.status(200).json({
      message: "Post liked successfully",
      likes: post.likes.length,
      dislikes: post.dislikes.length,
      userAction: "liked",
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Dislike a post
// @route   PUT /api/posts/:id/dislike
// @access  Private
exports.dislikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if user already disliked this post
    const alreadyDisliked = post.dislikes.includes(userId);

    // Check if user previously liked this post
    const alreadyLiked = post.likes.includes(userId);

    // If user already disliked the post, remove the dislike (toggle behavior)
    if (alreadyDisliked) {
      post.dislikes = post.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
      await post.save();
      return res.status(200).json({
        message: "Dislike removed",
        likes: post.likes.length,
        dislikes: post.dislikes.length,
        userAction: "none",
      });
    }

    // If user previously liked, remove the like
    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    }

    // Add the dislike
    post.dislikes.push(userId);
    await post.save();

    res.status(200).json({
      message: "Post disliked successfully",
      likes: post.likes.length,
      dislikes: post.dislikes.length,
      userAction: "disliked",
    });
  } catch (error) {
    console.error("Dislike post error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get Like/Dislike status for a post by current user
// @route   GET /api/posts/:id/like-status
// @access  Private
exports.getLikeStatus = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userLiked = post.likes.includes(userId);
    const userDisliked = post.dislikes.includes(userId);

    let userAction = "none";
    if (userLiked) userAction = "liked";
    if (userDisliked) userAction = "disliked";

    res.status(200).json({
      likes: post.likes.length,
      dislikes: post.dislikes.length,
      userAction,
    });
  } catch (error) {
    console.error("Get like status error:", error);
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

// @desc    Get posts by userId
// @route   GET /api/posts/user/:userId
// @access  Private
exports.getPostsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate that the current user can access these posts
    // Users can see their own posts, or admins can see any user's posts
    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Not authorized to view these posts",
      });
    }

    // Get the posts by userId
    const posts = await Post.find({ author: userId })
      .populate("author", "name profilePicture")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 })
      .exec();

    // For each post, get the comment count
    const postsWithCommentCounts = await Promise.all(
      posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({
          post: post._id,
          isActive: true,
          isApproved: { $ne: false },
        });

        // Convert to plain object and add comment count
        const postObj = post.toObject();
        postObj.comments = commentCount;

        return postObj;
      })
    );

    res.json(postsWithCommentCounts);
  } catch (error) {
    console.error("Get posts by userId error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get posts with their comments
// @route   GET /api/posts/with-comments
// @access  Public
exports.getPostsWithComments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      search,
      sort = "createdAt",
      commentLimit = 3,
    } = req.query;

    // Set up the initial query for published and active posts
    let query = {
      status: "published",
      isActive: true,
    };

    if (category) {
      query.categories = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      const searchRegex = new RegExp(search.split(" ").join("|"), "i");
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { excerpt: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Determine sort order
    const sortOption = {};
    if (sort === "views") {
      sortOption.views = -1;
    } else if (sort === "createdAt") {
      sortOption.createdAt = -1;
    } else {
      sortOption[sort] = -1;
    }

    // First get the posts
    const posts = await Post.find(query)
      .populate("author", "name profilePicture")
      .populate("categories", "name slug")
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Post.countDocuments(query);

    // Get comments for all posts in parallel
    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        // Get recent comments for the post, limited to commentLimit
        const comments = await Comment.find({
          post: post._id,
          isActive: true,
          isApproved: { $ne: false },
        })
          .populate("author", "name profilePicture")
          .sort({ createdAt: -1 })
          .limit(parseInt(commentLimit))
          .exec();

        // Get total comment count
        const commentCount = await Comment.countDocuments({
          post: post._id,
          isActive: true,
          isApproved: { $ne: false },
        });

        // Convert to plain object and add comments
        const postObj = post.toObject();
        postObj.comments = comments;
        postObj.commentCount = commentCount;

        return postObj;
      })
    );

    res.json({
      posts: postsWithComments,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Get posts with comments error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get similar posts based on categories and tags
// @route   GET /api/posts/:id/similar
// @access  Public
exports.getSimilarPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    // Find the post by ID
    const post = await Post.findById(id).populate("categories");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get the categories and tags from the post
    const categoryIds = post.categories.map((category) => category._id);
    const tags = post.tags || [];

    // Build the query to find similar posts
    const query = {
      _id: { $ne: post._id }, // Exclude the current post
      status: "published", // Only published posts
      isActive: true, // Only active posts
      $or: [
        { categories: { $in: categoryIds } }, // Posts with matching categories
        { tags: { $in: tags } }, // Posts with matching tags
      ],
    };

    // Find similar posts
    const similarPosts = await Post.find(query)
      .populate("author", "name profilePicture")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .exec();

    // Get comment counts for each post
    const postsWithCommentCounts = await Promise.all(
      similarPosts.map(async (similarPost) => {
        const commentCount = await Comment.countDocuments({
          post: similarPost._id,
          isActive: true,
          isApproved: { $ne: false },
        });

        // Convert to plain object and add comment count
        const postObj = similarPost.toObject();
        postObj.commentCount = commentCount;

        return postObj;
      })
    );

    res.json(postsWithCommentCounts);
  } catch (error) {
    console.error("Error fetching similar posts:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
