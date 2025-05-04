"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaNewspaper,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaImage,
  FaUpload,
  FaPlus,
  FaTag,
  FaCheck,
  FaTimesCircle,
  FaInfoCircle,
  FaLayerGroup,
  FaEye,
} from "react-icons/fa";
import dynamic from "next/dynamic";

// Import the rich text editor component dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function CreatePost() {
  const { isAuthenticated, loading, isAdmin, user } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [contentTab, setContentTab] = useState("edit"); // 'edit' or 'preview'
  const [dragActive, setDragActive] = useState(false);

  // Form data state
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: null,
    categories: [],
    tags: [],
    status: "draft", // default status
    isFeatured: false,
  });

  // Handle tag input
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login?redirect=/admin/posts/create");
      return;
    }

    // Fetch categories
    fetchCategories();
  }, [isAuthenticated, isAdmin, loading, router]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPostData({
      ...postData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleContentChange = (content) => {
    setPostData({
      ...postData,
      content,
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleImageFile(file);
    }
  };

  const handleImageFile = (file) => {
    if (file && file.type.match(/image.*/)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPostData({
          ...postData,
          coverImage: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;

    if (selectedCategoryId === "add-new") {
      setShowCategoryInput(true);
      return;
    }

    const selectedCategory = categories.find(
      (cat) => cat._id === selectedCategoryId
    );

    if (
      selectedCategory &&
      !postData.categories.some((cat) => cat._id === selectedCategoryId)
    ) {
      setPostData({
        ...postData,
        categories: [...postData.categories, selectedCategory],
      });
    }
  };

  const handleRemoveCategory = (categoryId) => {
    setPostData({
      ...postData,
      categories: postData.categories.filter((cat) => cat._id !== categoryId),
    });
  };

  const handleAddNewCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newCategory }),
        }
      );

      if (response.ok) {
        const category = await response.json();
        setCategories([...categories, category]);
        setPostData({
          ...postData,
          categories: [...postData.categories, category],
        });
        setNewCategory("");
        setShowCategoryInput(false);
      } else {
        setErrorMessage("Failed to create new category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      setErrorMessage("Failed to create new category");
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !postData.tags.includes(tag)) {
      setPostData({
        ...postData,
        tags: [...postData.tags, tag],
      });
      setTagInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tag) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter((t) => t !== tag),
    });
  };

  const validateForm = () => {
    if (!postData.title.trim()) {
      setErrorMessage("Title is required");
      return false;
    }

    if (!postData.content.trim()) {
      setErrorMessage("Content is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const status = publishStatus || postData.status;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare data for submission
      const postSubmitData = {
        ...postData,
        status,
        categories: postData.categories.map((cat) => cat._id),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postSubmitData),
        }
      );

      if (response.ok) {
        const createdPost = await response.json();
        setSuccessMessage(`Post created successfully as ${status}!`);

        // Redirect to post list after a short delay
        setTimeout(() => {
          router.push("/admin/posts");
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // React Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      {/* Floating Action Bar */}
      <div className=" bg-white  shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/posts"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Back to posts"
            >
              <FaArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <FaNewspaper className="mr-2 h-5 w-5 text-blue-600" />
              Create New Post
            </h1>
          </div>
          <div className="flex space-x-2">
            <div className="relative inline-block text-left">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "draft")}
                disabled={isSubmitting}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaSave className="mr-2 h-4 w-4" />
                Save Draft
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, "published")}
              disabled={isSubmitting}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaUpload className="mr-2 h-4 w-4" />
              {isSubmitting ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Messages */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - Post Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Excerpt Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                {/* Post Title */}
                <motion.div variants={itemVariants} className="mb-4">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={postData.title}
                    onChange={handleChange}
                    className="block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-600 text-2xl font-bold placeholder-gray-400"
                    placeholder="Enter your post title"
                    autoComplete="off"
                  />
                </motion.div>

                {/* Post Excerpt */}
                <motion.div variants={itemVariants}>
                  <textarea
                    name="excerpt"
                    id="excerpt"
                    rows={2}
                    value={postData.excerpt}
                    onChange={handleChange}
                    className="block w-full border-0 focus:ring-0 text-gray-500 resize-none placeholder-gray-400"
                    placeholder="Write a brief excerpt for your post..."
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Content Editor Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              {/* Editor Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    type="button"
                    onClick={() => setContentTab("edit")}
                    className={`py-3 px-6 inline-flex items-center ${
                      contentTab === "edit"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FaLayerGroup
                      className={`mr-2 h-4 w-4 ${
                        contentTab === "edit"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setContentTab("preview")}
                    className={`py-3 px-6 inline-flex items-center ${
                      contentTab === "preview"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FaEye
                      className={`mr-2 h-4 w-4 ${
                        contentTab === "preview"
                          ? "text-blue-600"
                          : "text-gray-500"
                      }`}
                    />
                    Preview
                  </button>
                </div>
              </div>

              {/* Editor Content */}
              <div className="p-4">
                {contentTab === "edit" ? (
                  <motion.div variants={itemVariants}>
                    <div className="min-h-[400px]">
                      {typeof window !== "undefined" && (
                        <ReactQuill
                          theme="snow"
                          value={postData.content}
                          onChange={handleContentChange}
                          modules={quillModules}
                          className="h-[350px]"
                          placeholder="Write your post content here..."
                        />
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={itemVariants}
                    className="min-h-[400px] prose max-w-none p-4 border rounded-md"
                  >
                    {postData.content ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: postData.content }}
                      />
                    ) : (
                      <div className="text-gray-400 italic">
                        Your preview will appear here once you start writing...
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Cover Image Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-lg font-medium text-gray-700">
                    <FaImage className="inline mr-2 text-blue-600" /> Cover
                    Image
                  </label>
                </div>

                <motion.div
                  variants={itemVariants}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative mt-1 border-2 ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-dashed border-gray-300"
                  } rounded-lg transition-colors duration-200 ease-in-out`}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <div className="relative w-full h-64 mx-auto rounded-md overflow-hidden">
                        <Image
                          src={imagePreview}
                          alt="Cover image preview"
                          fill
                          unoptimized={true}
                          style={{ objectFit: "cover" }}
                          className="transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setPostData({ ...postData, coverImage: null });
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 focus:outline-none shadow-lg"
                        title="Remove image"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="px-6 pt-5 pb-6 flex items-center justify-center">
                      <div className="space-y-1 text-center">
                        <div className="flex flex-col items-center">
                          <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                          <p className="mt-1 text-sm text-gray-600">
                            Drag and drop an image, or
                            <label
                              htmlFor="cover-image-upload"
                              className="relative cursor-pointer ml-1 text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                            >
                              <span>browse</span>
                              <input
                                id="cover-image-upload"
                                name="cover-image-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                              />
                            </label>
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Publication Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Categories
                </h2>

                <motion.div variants={itemVariants}>
                  {/* Selected Categories */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {postData.categories.map((category) => (
                      <div
                        key={category._id}
                        className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        {category.name}
                        <button
                          type="button"
                          onClick={() => handleRemoveCategory(category._id)}
                          className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {postData.categories.length === 0 && (
                      <span className="text-gray-400 text-sm italic">
                        No categories selected
                      </span>
                    )}
                  </div>

                  {showCategoryInput ? (
                    <div className="mt-2 mb-4">
                      <div className="flex">
                        <input
                          type="text"
                          className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          placeholder="New category name"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={handleAddNewCategory}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaPlus className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCategoryInput(false);
                            setNewCategory("");
                          }}
                          className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <select
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                        onChange={handleCategoryChange}
                        value=""
                      >
                        <option value="" disabled>
                          Select a category
                        </option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                        <option value="add-new">+ Add New Category</option>
                      </select>
                    </>
                  )}
                  {!showCategoryInput && (
                    <button
                      type="button"
                      onClick={() => setShowCategoryInput(true)}
                      className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
                    >
                      <FaPlus className="h-3 w-3 mr-1" /> Add New Category
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* Tags Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Tags</h2>

                <motion.div variants={itemVariants}>
                  {/* Selected Tags */}
                  <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
                    {postData.tags.map((tag) => (
                      <div
                        key={tag}
                        className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        <FaTag className="h-3 w-3 mr-1 text-gray-500" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                          <FaTimes className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex mt-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FaPlus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <FaInfoCircle className="mr-1 h-3 w-3" /> Press Enter after
                    each tag
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Publish Settings Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Publication Settings
                </h2>

                {/* Status Option */}
                <motion.div variants={itemVariants} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex flex-col space-y-2">
                    <label
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        postData.status === "draft"
                          ? "bg-blue-50 border-blue-300 text-blue-800"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={postData.status === "draft"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <FaSave
                          className={`mr-2 h-4 w-4 ${
                            postData.status === "draft"
                              ? "text-blue-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span>Draft</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        postData.status === "pending"
                          ? "bg-yellow-50 border-yellow-300 text-yellow-800"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="pending"
                        checked={postData.status === "pending"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <FaInfoCircle
                          className={`mr-2 h-4 w-4 ${
                            postData.status === "pending"
                              ? "text-yellow-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span>Submit for Review</span>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        postData.status === "published"
                          ? "bg-green-50 border-green-300 text-green-800"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={postData.status === "published"}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex items-center">
                        <FaUpload
                          className={`mr-2 h-4 w-4 ${
                            postData.status === "published"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span>Published</span>
                      </div>
                    </label>
                  </div>
                </motion.div>

                {/* Featured Post Option */}
                <motion.div variants={itemVariants} className="mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <label
                        htmlFor="isFeatured"
                        className="font-medium text-gray-700 cursor-pointer"
                      >
                        Featured Post
                      </label>
                      <div
                        className="ml-2 text-gray-400 hover:text-gray-500"
                        title="Featured posts appear prominently on the homepage"
                      >
                        <FaInfoCircle className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        name="isFeatured"
                        checked={postData.isFeatured}
                        onChange={handleChange}
                        className="absolute block w-6 h-6 bg-white border-4 rounded-full appearance-none cursor-pointer checked:right-0 checked:border-blue-600 focus:outline-none"
                      />
                      <label
                        htmlFor="isFeatured"
                        className={`block h-6 overflow-hidden rounded-full cursor-pointer ${
                          postData.isFeatured ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      ></label>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col space-y-2"
                >
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, postData.status)}
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {postData.status === "published"
                          ? "Publishing..."
                          : "Saving..."}
                      </>
                    ) : (
                      <>
                        {postData.status === "published" ? (
                          <>
                            <FaUpload className="mr-2 h-4 w-4" />
                            Publish
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-2 h-4 w-4" />
                            Save Draft
                          </>
                        )}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) =>
                      handleSubmit(
                        e,
                        postData.status === "published" ? "draft" : "published"
                      )
                    }
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {postData.status === "published"
                      ? "Save as Draft"
                      : "Publish Now"}
                  </button>
                  <Link
                    href="/admin/posts"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-center font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaTimes className="mr-2 h-4 w-4" />
                    Cancel
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-blue-50 rounded-lg overflow-hidden border border-blue-100"
            >
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <FaInfoCircle className="h-5 w-5 text-blue-500" />
                  <h2 className="ml-2 text-lg font-medium text-blue-800">
                    Writing Tips
                  </h2>
                </div>
                <motion.ul
                  variants={itemVariants}
                  className="text-sm text-blue-700 space-y-2 pl-5 list-disc"
                >
                  <li>Use a clear, attention-grabbing title</li>
                  <li>Break up content with subheadings</li>
                  <li>Include relevant images to enhance your content</li>
                  <li>
                    Use categories and tags to help readers find your post
                  </li>
                  <li>Preview your post before publishing</li>
                </motion.ul>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
