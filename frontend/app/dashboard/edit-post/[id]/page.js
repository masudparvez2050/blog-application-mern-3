"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-hot-toast";

// Import components
import PostActionBar from "@/app/components/posts/PostActionBar";
import PostTitleAndExcerpt from "@/app/components/posts/PostTitleAndExcerpt";
import ContentEditor from "@/app/components/posts/ContentEditor";
import CoverImageUploader from "@/app/components/posts/CoverImageUploader";
import CategorySelector from "@/app/components/posts/CategorySelector";
import TagEditor from "@/app/components/posts/TagEditor";
import PublicationSettings from "@/app/components/posts/PublicationSettings";
import Notification from "@/app/components/shared/Notification";
import DeleteConfirmationModal from "@/app/components/posts/DeleteConfirmationModal";
import PostStatusInfo from "@/app/components/posts/PostStatusInfo";
import EditingTips from "@/app/components/posts/EditingTips";

// Import services and utilities
import {
  updatePost,
  deletePost,
  getPostById,
} from "@/app/services/postService";
import {
  getAllCategories,
  createCategory,
} from "@/app/services/postService/categoryService";
import {
  validatePostForm,
  preparePostDataForSubmission,
  fileToBase64,
} from "@/app/utils/postFormUtils";
import { FaArrowLeft } from "react-icons/fa";

/**
 * Edit Post page component
 * Allows users to edit existing blog posts
 */
export default function EditPost() {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  // States for UI control and messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // States for form data and categories
  const [categories, setCategories] = useState([]);
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

  // Fetch post data when component mounts
  const fetchPost = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const post = await getPostById(postId, token);

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
    } catch (error) {
      console.error("Error fetching post:", error);
      setErrorMessage("Failed to fetch post. Please try again.");
      setIsLoading(false);
    }
  }, [postId, router, user]);

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const categoriesData = await getAllCategories(token);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    }
  }, []);

  // Check authentication and fetch initial data
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
      categories: postData.categories.filter((cat) => {
        return cat._id ? cat._id !== categoryId : cat !== categoryId;
      }),
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
    if (!postData.tags.includes(tag)) {
      setPostData({
        ...postData,
        tags: [...postData.tags, tag],
      });
    }
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

      // Update the post
      await updatePost(postId, postSubmitData, token);

      setSuccessMessage(
        `Post updated successfully as ${
          finalStatus === "draft" ? "Draft" : "Pending Review"
        }!`
      );

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error updating post:", error);
      setErrorMessage("Failed to update post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle post deletion
  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      await deletePost(postId, token);

      setSuccessMessage("Post deleted successfully!");

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error deleting post:", error);
      setErrorMessage("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
    }
  };

  // Loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Unauthorized access
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
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmOpen}
        isDeleting={isDeleting}
        onCancel={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
      />

      {/* Action Bar */}
      <PostActionBar
        isEditing={true}
        isSubmitting={isSubmitting}
        onSaveDraft={(e) => handleSubmit(e, "draft")}
        onSubmitForReview={(e) => handleSubmit(e, "pending")}
        onDelete={() => setDeleteConfirmOpen(true)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
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
              onDelete={() => setDeleteConfirmOpen(true)}
              isEditing={true}
            />

            {/* Post Status Info - Only show if post was ever published */}
            {postData.status === "published" && <PostStatusInfo />}

            {/* Editing Tips */}
            <EditingTips />
          </div>
        </div>
      </main>
    </div>
  );
}
