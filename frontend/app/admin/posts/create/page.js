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
  FaLayerGroup,
  FaEye,
} from "react-icons/fa";
import dynamic from "next/dynamic";
import { MessageAlert } from "@/app/components/shared/notifications/MessageAlert";

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Floating Action Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link
              href="/admin/posts"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Back to posts"
            >
              <FaArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <FaNewspaper className="mr-2 h-5 w-5 text-indigo-600" />
              Create New Post
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaSave className="mr-2 h-4 w-4" />
              Save Draft
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, "published")}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FaCheck className="mr-2 h-4 w-4" />
              Publish
            </button>
          </div>
        </div>
      </header>

      <main className="">
        {/* Message Alerts */}
        {errorMessage && (
          <MessageAlert
            message={errorMessage}
            type="error"
            onClose={() => setErrorMessage("")}
          />
        )}

        {successMessage && (
          <MessageAlert
            message={successMessage}
            type="success"
            onClose={() => setSuccessMessage("")}
          />
        )}

        <div className="mt-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main Content Area */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              {/* Title Input */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Post Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={postData.title}
                  onChange={handleChange}
                  placeholder="Enter post title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Content Editor with Tabs */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex border-b border-gray-100">
                  <button
                    onClick={() => setContentTab("edit")}
                    className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
                      contentTab === "edit"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Edit Content
                  </button>
                  <button
                    onClick={() => setContentTab("preview")}
                    className={`px-4 py-3 text-sm font-medium flex-1 text-center ${
                      contentTab === "preview"
                        ? "text-indigo-600 border-b-2 border-indigo-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Preview
                  </button>
                </div>
                <div className="p-5">
                  {contentTab === "edit" ? (
                    <div className="min-h-[300px]">
                      <ReactQuill
                        value={postData.content}
                        onChange={handleContentChange}
                        modules={quillModules}
                        className="h-full"
                        placeholder="Write your post content here..."
                      />
                    </div>
                  ) : (
                    <div className="prose max-w-none min-h-[300px] p-4 border rounded-md bg-gray-50">
                      {postData.content ? (
                        <div
                          dangerouslySetInnerHTML={{ __html: postData.content }}
                        />
                      ) : (
                        <p className="text-gray-400 italic">
                          No content to preview
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <label
                  htmlFor="excerpt"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Excerpt (Short summary)
                </label>
                <textarea
                  name="excerpt"
                  id="excerpt"
                  rows="3"
                  value={postData.excerpt}
                  onChange={handleChange}
                  placeholder="Brief summary of your post (shown in previews)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
            </motion.div>

            {/* Sidebar Options */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Cover Image Upload */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaImage className="mr-2 h-4 w-4 text-indigo-600" />
                  Cover Image
                </h3>

                <div
                  className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                    dragActive
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-gray-300"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="w-full relative">
                      <div className="relative h-48 w-full mb-3">
                        <Image
                          src={imagePreview}
                          alt="Cover preview"
                          className="rounded-md object-cover"
                          fill
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setPostData({
                            ...postData,
                            coverImage: null,
                          });
                        }}
                        className="bg-white rounded-full p-1 absolute top-2 right-2 shadow-md hover:bg-gray-100"
                      >
                        <FaTimes className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <FaUpload className="mx-auto h-12 w-12 text-gray-300" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="cover-image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="cover-image"
                            name="cover-image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaLayerGroup className="mr-2 h-4 w-4 text-indigo-600" />
                  Categories
                </h3>
                {showCategoryInput ? (
                  <div className="flex mt-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="New category name"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewCategory}
                      className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <select
                    onChange={handleCategoryChange}
                    value=""
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                    <option value="add-new">+ Add new category</option>
                  </select>
                )}

                {/* Selected Categories */}
                <div className="mt-2">
                  {postData.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {postData.categories.map((category) => (
                        <span
                          key={category._id}
                          className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-indigo-50 text-indigo-700"
                        >
                          {category.name}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(category._id)}
                            className="ml-1 text-indigo-500 hover:text-indigo-700"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      No categories selected
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <FaTag className="mr-2 h-4 w-4 text-indigo-600" />
                  Tags
                </h3>
                <div className="flex mt-1">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add tag and press Enter"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Tags */}
                <div className="mt-2">
                  {postData.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {postData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-sm bg-gray-100 text-gray-800"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">No tags added</p>
                  )}
                </div>
              </div>

              {/* Featured Toggle */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <span className="mr-2 text-yellow-500">★</span>
                    Feature this post
                  </h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={postData.isFeatured}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Featured posts are shown prominently on the homepage
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
