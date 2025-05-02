"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
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
  FaTrash,
  FaLayerGroup,
  FaEye,
} from "react-icons/fa";
import dynamic from "next/dynamic";

// Import the rich text editor component dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function EditPost() {
  const { isAuthenticated, loading, user } = useAuth();
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [contentTab, setContentTab] = useState("edit"); // 'edit' or 'preview'
  const [dragActive, setDragActive] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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

        // Check if the current user is the author of the post
        if (user && post.author && post.author._id === user._id) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          setErrorMessage("You are not authorized to edit this post.");
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
          return;
        }

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
  }, [postId, router, user]);

  const fetchCategories = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=/dashboard/edit-post/${postId}`);
      return;
    }

    if (isAuthenticated && postId) {
      // Fetch post data and categories
      fetchPost();
      fetchCategories();
    }
  }, [isAuthenticated, loading, router, postId, fetchPost, fetchCategories]);

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
    if (
      e.type === "dragenter" ||
      e.type === "dragleave" ||
      e.type === "dragover"
    ) {
      setDragActive(e.type === "dragenter" || e.type === "dragover");
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
          coverImage: file,
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
      !postData.categories.some((cat) => {
        return cat._id
          ? cat._id === selectedCategoryId
          : cat === selectedCategoryId;
      })
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
      categories: postData.categories.filter((cat) => {
        return cat._id ? cat._id !== categoryId : cat !== categoryId;
      }),
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

    // For users, prevent selecting "published" status - force to draft or pending
    const finalStatus = ["draft", "pending"].includes(status)
      ? status
      : "pending";

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare data for submission in JSON format
      const postSubmitData = {
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        categories: postData.categories.map((cat) =>
          typeof cat === "object" && cat._id ? cat._id : cat
        ),
        tags: postData.tags,
        status: finalStatus,
        isFeatured: postData.isFeatured,
      };

      // Handle the coverImage
      if (postData.coverImage instanceof File) {
        // Convert File to base64
        const reader = new FileReader();
        const base64Promise = new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(postData.coverImage);
        });

        postSubmitData.coverImage = await base64Promise;
      } else {
        // If it's already a string (URL), pass it through
        postSubmitData.coverImage = postData.coverImage;
      }

      console.log("Sending update data:", postSubmitData);

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
        setSuccessMessage(
          `Post updated successfully as ${
            finalStatus === "draft" ? "Draft" : "Pending Review"
          }!`
        );

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
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

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard");
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
      setDeleteConfirmOpen(false);
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

  if (!isAuthorized && !isLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 max-w-2xl rounded-md shadow-md">
          <p className="font-bold">Not Authorized</p>
          <p className="mt-1">You can only edit your own posts.</p>
          <Link
            href="/dashboard"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 hover:underline flex items-center"
          >
            <FaArrowLeft className="mr-1" /> Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      {/* Delete confirmation modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                {isDeleting ? (
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
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="mr-2" /> Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Bar */}
      <div className=" bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Back to dashboard"
            >
              <FaArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <FaNewspaper className="mr-2 h-5 w-5 text-blue-600" />
              Edit Post
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
              onClick={(e) => handleSubmit(e, "pending")}
              disabled={isSubmitting}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <FaUpload className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit for Review"}
            </button>

            <button
              type="button"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={isDeleting || isSubmitting}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaTrash className="h-4 w-4" />
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

                    {/* If post was already published, show this as disabled option */}
                    {postData.status === "published" && (
                      <label className="flex items-center p-3 border rounded-md cursor-not-allowed bg-gray-50 border-gray-200 text-gray-500">
                        <input
                          type="radio"
                          name="status"
                          value="published"
                          checked={true}
                          onChange={() => {}}
                          className="sr-only"
                          disabled
                        />
                        <div className="flex items-center">
                          <FaCheck className="mr-2 h-4 w-4 text-gray-400" />
                          <span>Published (Can&apos;t modify)</span>
                        </div>
                      </label>
                    )}
                  </div>

                  <div className="mt-2 text-xs text-gray-500 flex items-center">
                    <FaInfoCircle className="mr-1 h-3 w-3" />
                    Your post will be reviewed by an administrator before being
                    published.
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
                        Featured Post Request
                      </label>
                      <div
                        className="ml-2 text-gray-400 hover:text-gray-500"
                        title="Request to have your post featured on the homepage"
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
                  <div className="mt-1 text-xs text-gray-500">
                    Featured status is subject to admin approval.
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
                        {postData.status === "pending"
                          ? "Submitting..."
                          : "Saving..."}
                      </>
                    ) : (
                      <>
                        {postData.status === "pending" ? (
                          <>
                            <FaUpload className="mr-2 h-4 w-4" />
                            Submit for Review
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
                    onClick={() => setDeleteConfirmOpen(true)}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FaTrash className="mr-2 h-4 w-4" />
                    Delete Post
                  </button>
                  <Link
                    href="/dashboard"
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm text-center font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaTimes className="mr-2 h-4 w-4" />
                    Cancel
                  </Link>
                </motion.div>
              </div>
            </motion.div>

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
                    {postData.categories.map((category, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        {category.name || category}
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveCategory(category._id || category)
                          }
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

            {/* Post History Card - Only show if post was ever published */}
            {postData.status === "published" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Post Status
                  </h2>

                  <motion.div
                    variants={itemVariants}
                    className="text-sm text-gray-600"
                  >
                    <div className="flex items-center mb-2">
                      <FaInfoCircle className="text-blue-500 mr-2" />
                      <p>
                        This post was previously published. Editing it will
                        require re-approval.
                      </p>
                    </div>
                    <div className="mt-2 p-3 bg-yellow-50 rounded-md border border-yellow-100">
                      <p className="text-yellow-800">
                        When you submit changes, the post will be unpublished
                        and sent for review again.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

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
                    Editing Tips
                  </h2>
                </div>
                <motion.ul
                  variants={itemVariants}
                  className="text-sm text-blue-700 space-y-2 pl-5 list-disc"
                >
                  <li>Use a clear, attention-grabbing title</li>
                  <li>Break up content with subheadings</li>
                  <li>Include relevant images to enhance your content</li>
                  <li>Preview your changes before saving</li>
                  <li>
                    Remember that edited posts will need to be reviewed again
                  </li>
                </motion.ul>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
