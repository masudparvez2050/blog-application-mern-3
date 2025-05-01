const Category = require("../models/Category");
const Post = require("../models/Post");

// Helper function to generate a slug from a name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    const { active } = req.query;
    const query = {};

    // Filter by active status if provided
    if (active === "true") {
      query.isActive = true;
    } else if (active === "false") {
      query.isActive = false;
    }

    const categories = await Category.find(query).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Get all categories error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category by ID error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category by slug error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin only)
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if category with the same name already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res
        .status(400)
        .json({ message: "Category with this name already exists" });
    }

    // Generate slug from name
    const slug = req.body.slug || generateSlug(name);

    // Check if slug is unique
    const slugExists = await Category.findOne({ slug });
    if (slugExists) {
      return res
        .status(400)
        .json({ message: "Category with this slug already exists" });
    }

    const category = new Category({
      name,
      slug,
      description: description || "",
      isActive: true,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // If name is changing, check if it's unique
    if (name && name !== category.name) {
      const nameExists = await Category.findOne({ name });
      if (nameExists) {
        return res
          .status(400)
          .json({ message: "Category with this name already exists" });
      }
    }

    // If slug is provided, check if it's unique
    if (req.body.slug && req.body.slug !== category.slug) {
      const slugExists = await Category.findOne({ slug: req.body.slug });
      if (slugExists) {
        return res
          .status(400)
          .json({ message: "Category with this slug already exists" });
      }
      category.slug = req.body.slug;
    } else if (name && name !== category.name) {
      // Generate new slug if name changed but slug not provided
      category.slug = generateSlug(name);
    }

    // Update fields
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error("Update category error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category is used in any posts
    const postCount = await Post.countDocuments({ categories: category.name });
    if (postCount > 0) {
      return res.status(400).json({
        message: "Cannot delete category that is in use",
        posts: postCount,
      });
    }

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (error) {
    console.error("Delete category error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
