"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../../context/AuthContext";
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
  FaTrash,
} from "react-icons/fa";
import dynamic from "next/dynamic";

// Import the rich text editor component dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditPost() {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form data state
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: null,
    categories: [],
    tags: [],
    status: "draft",
    isFeatured: false,
  });

  // Handle tag input
  const [tagInput, setTagInput] = useState("");

  const fetchPost = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
        {
          headers: {
        Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const post = await response.json();

        // Set the post data
        setPostData({
          title: post.title || "",
          content: post.content || "",
          excerpt: post.excerpt || "",
          coverImage: post.coverImage || null,
          categories: post.categories || [],
          tags: post.tags || [],
          status: post.status || "draft",
          isFeatured: post.isFeatured || false,
        });

        // Set image preview if cover image exists
        if (post.coverImage) {
          setImagePreview(post.coverImage);
        }

        setIsLoading(false);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to fetch post");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setErrorMessage("Failed to fetch post. Please try again.");
      setIsLoading(false);
    }
  }, [postId]);

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push(`/login?redirect=/admin/posts/edit/${postId}`);
      return;
    }

    if (isAuthenticated && postId) {
      // Fetch post data and categories
      fetchPost();
      fetchCategories();
    }
  }, [
    isAuthenticated,
    isAdmin,
    loading,
    router,
    postId,
    fetchPost,
    fetchCategories,
  ]);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
        {
          method: "PUT",
          headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postSubmitData),
        }
      );

      if (response.ok) {
        const updatedPost = await response.json();
        setSuccessMessage(`Post updated successfully as ${status}!`);

        // Redirect to post list after a short delay
        setTimeout(() => {
          router.push("/admin/posts");
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setErrorMessage("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
        Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSuccessMessage("Post deleted successfully!");

        // Redirect to post list after a short delay
        setTimeout(() => {
          router.push("/admin/posts");
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setErrorMessage("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin/posts" className="mr-4">
              <FaArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaNewspaper className="mr-2 h-6 w-6 text-blue-600" />
              Edit Post
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSave className="mr-2 h-4 w-4" />
              Save as Draft
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "published")}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaUpload className="mr-2 h-4 w-4" />
              Publish Now
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Messages */}
        {errorMessage && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaTimesCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="p-6 space-y-6">
              {/* Title input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Post Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={postData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter a descriptive title for your post"
                />
              </motion.div>

              {/* Excerpt input */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Excerpt
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <textarea
                    name="excerpt"
                    id="excerpt"
                    rows={3}
                    value={postData.excerpt}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="A short summary of your post (will be displayed in previews)"
                  />
                </div>
              </motion.div>

              {/* Content editor */}
              <motion.div variants={itemVariants} className="h-96">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Post Content
                </label>
                {typeof window !== "undefined" && (
                  <div className="h-80">
                    <ReactQuill
                      theme="snow"
                      value={postData.content}
                      onChange={handleContentChange}
                      modules={quillModules}
                      className="h-72"
                      placeholder="Write your post content here..."
                    />
                  </div>
                )}
              </motion.div>

              {/* Cover image upload */}
              <motion.div variants={itemVariants} className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Image
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative w-full h-64 mx-auto">
                        <Image
                          src={imagePreview}
                          alt="Cover image preview"
                          fill
                          style={{ objectFit: "contain" }}
                          className="rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setPostData({ ...postData, coverImage: null });
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                        >
                          <FaTimes className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="cover-image-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                          >
                            <div className="flex flex-col items-center">
                              <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                              <span>Upload a cover image</span>
                              <input
                                id="cover-image-upload"
                                name="cover-image-upload"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={handleImageChange}
                              />
                            </div>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Categories Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-4">
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
                </div>

                {showCategoryInput ? (
                  <div className="flex mt-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                ) : (
                  <div className="flex items-center">
                    <select
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                  </div>
                )}
              </motion.div>

              {/* Tags Input */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {postData.tags.map((tag) => (
                    <div
                      key={tag}
                      className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      <FaTag className="h-3 w-3 mr-1" />
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
                    className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <p className="mt-1 text-xs text-gray-500">
                  Press Enter after each tag or click the plus button to add
                </p>
              </motion.div>

              {/* Status Selection */}
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Post Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={postData.status}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="pending">Pending Review</option>
                </select>
              </motion.div>

              {/* Featured checkbox */}
              <motion.div variants={itemVariants} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="isFeatured"
                    name="isFeatured"
                    type="checkbox"
                    checked={postData.isFeatured}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="isFeatured"
                    className="font-medium text-gray-700"
                  >
                    Feature this post
                  </label>
                  <p className="text-gray-500">
                    Featured posts appear prominently on the homepage
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Submit buttons - bottom sticky bar */}
            <div className="sticky bottom-0 bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "published")}
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
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
                    Updating...
                  </span>
                ) : (
                  <>
                    <FaUpload className="mr-2 h-4 w-4" />
                    Publish Now
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "draft")}
                disabled={isSubmitting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                <FaSave className="mr-2 h-4 w-4" />
                Save as Draft
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, "pending")}
                disabled={isSubmitting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-blue-300 shadow-sm px-4 py-2 bg-blue-50 text-base font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Submit for Review
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-red-50 text-base font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700"
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
                    Deleting...
                  </span>
                ) : (
                  <>
                    <FaTrash className="mr-2 h-4 w-4" />
                    Delete Post
                  </>
                )}
              </button>
              <Link
                href="/admin/posts"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
              >
                <FaTimes className="mr-2 h-4 w-4" />
                Cancel
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
