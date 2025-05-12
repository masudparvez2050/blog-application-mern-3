"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

// Import components
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import PostActionBar from "@/app/components/posts/PostActionBar";
import PostTitleAndExcerpt from "@/app/components/posts/PostTitleAndExcerpt";
import ContentEditor from "@/app/components/posts/ContentEditor";
import CoverImageUploader from "@/app/components/posts/CoverImageUploader";
import CategorySelector from "@/app/components/posts/CategorySelector";
import TagEditor from "@/app/components/posts/TagEditor";
import PublicationSettings from "@/app/components/posts/PublicationSettings";
import WritingTips from "@/app/components/posts/WritingTips";
import Notification from "@/app/components/shared/Notification";

// Import services and utilities
import { createPost } from "@/app/services/postService";
import {
  getAllCategories,
  createCategory,
} from "@/app/services/postService/categoryService";
import {
  validatePostForm,
  preparePostDataForSubmission,
  fileToBase64,
} from "@/app/utils/postFormUtils";

/**
 * Create Post page component
 * Allows users to create new blog posts
 * Protected by authentication
 */
export default function CreatePost() {
  const { user } = useAuth();
  const router = useRouter();

  // States for form data and UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [tagInput, setTagInput] = useState("");

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

  // Fetch categories when component mounts
  useEffect(() => {
    fetchCategories();
  }, []);
 

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

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const categoriesData = await getAllCategories(token);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // Generic change handler for form inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPostData({
      ...postData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle rich text content changes
  const handleContentChange = (content) => {
    setPostData({
      ...postData,
      content,
    });
  };

  // Handle image selection for cover image
  const handleImageChange = async (file) => {
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

  // Handle image removal
  const handleImageRemove = () => {
    setImagePreview(null);
    setPostData({
      ...postData,
      coverImage: null,
    });
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setPostData({
      ...postData,
      categories: [...postData.categories, category],
    });
  };

  // Handle category removal
  const handleCategoryRemove = (categoryId) => {
    setPostData({
      ...postData,
      categories: postData.categories.filter((cat) => cat._id !== categoryId),
    });
  };

  // Create new category
  const handleCreateCategory = async (categoryName) => {
    try {
      const token = localStorage.getItem("token");
      const newCategory = await createCategory(categoryName, token);
      setCategories([...categories, newCategory]);
      setPostData({
        ...postData,
        categories: [...postData.categories, newCategory],
      });
      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create new category");
      throw error;
    }
  };

  // Add a tag
  const handleAddTag = (tag) => {
    setPostData({
      ...postData,
      tags: [...postData.tags, tag],
    });
  };

  // Remove a tag
  const handleRemoveTag = (tag) => {
    setPostData({
      ...postData,
      tags: postData.tags.filter((t) => t !== tag),
    });
  };

  // Submit the form with specified status
  const handleSubmit = async (e, publishStatus) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const status = publishStatus || postData.status;

    // For users, prevent selecting "published" status - force to draft or pending
    const finalStatus = ["draft", "pending"].includes(status)
      ? status
      : "pending";

    // Validate form data
    const { isValid, errorMessage } = validatePostForm(postData);
    if (!isValid) {
      setErrorMessage(errorMessage);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare post data for submission
      const postSubmitData = preparePostDataForSubmission(
        postData,
        finalStatus
      );

      // Convert cover image to base64 if it's a File object
      if (postData.coverImage instanceof File) {
        postSubmitData.coverImage = await fileToBase64(postData.coverImage);
      }

      // Create the post
      await createPost(postSubmitData, token);

      setSuccessMessage(
        `Post created successfully as ${
          finalStatus === "draft" ? "Draft" : "Pending Review"
        }!`
      );

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error creating post:", error);
      setErrorMessage("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      {/* Action Bar */}
      <PostActionBar
        isSubmitting={isSubmitting}
        onSaveDraft={(e) => handleSubmit(e, "draft")}
        onSubmitForReview={(e) => handleSubmit(e, "pending")}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
        {/* Notifications */}
        <Notification type="error" message={errorMessage} />
        <Notification type="success" message={successMessage} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column - Post Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Excerpt */}
            <PostTitleAndExcerpt
              title={postData.title}
              excerpt={postData.excerpt}
              onChange={handleChange}
            />

            {/* Content Editor */}
            <ContentEditor
              content={postData.content}
              onChange={handleContentChange}
            />

            {/* Cover Image */}
            <CoverImageUploader
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onImageRemove={handleImageRemove}
            />
          </div>

          {/* Sidebar - Publication Settings */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <CategorySelector
              categories={categories}
              selectedCategories={postData.categories}
              onCategorySelect={handleCategorySelect}
              onCategoryRemove={handleCategoryRemove}
              onCategoryCreate={handleCreateCategory}
            />

            {/* Tags */}
            <TagEditor
              tags={postData.tags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />

            {/* Publication Settings */}
            <PublicationSettings
              status={postData.status}
              isFeatured={postData.isFeatured}
              isSubmitting={isSubmitting}
              onStatusChange={handleChange}
              onFeaturedChange={handleChange}
              onSubmit={handleSubmit}
            />

            {/* Writing Tips */}
            <WritingTips />
          </div>
        </div>
      </main>
    </div>
  );
}
