"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaNewspaper,
  FaEdit,
  FaTrash,
  FaCheck,
  FaBan,
  FaArrowLeft,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaPlus,
  FaTimesCircle,
  FaCheckCircle,
  FaEye,
  FaThumbsUp,
  FaComment,
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaFilter,
  FaEllipsisV,
} from "react-icons/fa";

export default function PostsManagement() {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // grid or list

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts?page=${currentPage}&limit=10&sortField=${sortField}&sortDirection=${sortDirection}&status=${filterStatus}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setTotalPages(data.totalPages);
      } else {
        throw new Error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setErrorMessage("Failed to load posts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortField, sortDirection, filterStatus, searchTerm]);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login?redirect=/admin/posts");
      return;
    }

    // Fetch posts
    fetchPosts();
  }, [
    isAuthenticated,
    isAdmin,
    loading,
    router,
    currentPage,
    sortField,
    sortDirection,
    filterStatus,
    fetchPosts,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts();
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleDropdown = (postId) => {
    setActiveDropdown(activeDropdown === postId ? null : postId);
  };

  const openConfirmModal = (post, action) => {
    setActiveDropdown(null);
    setSelectedPost(post);
    setModalAction(action);

    switch (action) {
      case "delete":
        setModalMessage(
          `Are you sure you want to delete the post "${post.title}"? This action cannot be undone.`
        );
        break;
      case "approve":
        setModalMessage(
          `Are you sure you want to approve the post "${post.title}"? This will make it visible to all users.`
        );
        break;
      case "reject":
        setModalMessage(
          `Are you sure you want to reject the post "${post.title}"?`
        );
        break;
      case "feature":
        setModalMessage(
          `Are you sure you want to feature the post "${post.title}" on the homepage?`
        );
        break;
      case "unfeature":
        setModalMessage(
          `Are you sure you want to remove the post "${post.title}" from featured posts?`
        );
        break;
      default:
        setModalMessage("Are you sure you want to perform this action?");
    }

    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedPost || !modalAction) return;

    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      let method = "PUT";
      let body = {};

      switch (modalAction) {
        case "delete":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${selectedPost._id}`;
          method = "DELETE";
          break;
        case "approve":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${selectedPost._id}/status`;
          body = { status: "published" };
          break;
        case "reject":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${selectedPost._id}/status`;
          body = { status: "rejected" };
          break;
        case "feature":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${selectedPost._id}/feature`;
          body = { isFeatured: true };
          break;
        case "unfeature":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/posts/${selectedPost._id}/feature`;
          body = { isFeatured: false };
          break;
        default:
          throw new Error("Invalid action");
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: method !== "DELETE" ? JSON.stringify(body) : undefined,
      });

      if (response.ok) {
        setSuccessMessage(
          `Post ${
            modalAction === "delete"
              ? "deleted"
              : modalAction === "approve"
              ? "approved and published"
              : modalAction === "reject"
              ? "rejected"
              : modalAction === "feature"
              ? "featured on homepage"
              : "removed from featured posts"
          } successfully.`
        );

        // Update local state to reflect the changes
        if (modalAction === "delete") {
          setPosts(posts.filter((post) => post._id !== selectedPost._id));
        } else {
          fetchPosts(); // Refetch to get updated post status
        }
      } else {
        throw new Error("Failed to perform action");
      }
    } catch (error) {
      console.error(`Error ${modalAction} post:`, error);
      setErrorMessage(`Failed to ${modalAction} post. Please try again.`);
    } finally {
      setShowConfirmModal(false);
      setSelectedPost(null);
      setModalAction("");
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

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0 },
  };

  // Format date using more modern format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.round((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "published":
        return "bg-emerald-100 text-emerald-800 border border-emerald-200";
      case "draft":
        return "bg-amber-100 text-amber-800 border border-amber-200";
      case "pending":
        return "bg-sky-100 text-sky-800 border border-sky-200";
      case "rejected":
        return "bg-rose-100 text-rose-800 border border-rose-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  // Truncate text
  const truncateText = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (loading || (isLoading && posts.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 animate-pulse">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Render Grid View Card
  const renderGridCard = (post) => (
    <motion.div
      variants={itemVariants}
      key={post._id}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 flex flex-col"
    >
      <div className="relative h-40 w-full bg-gray-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaNewspaper className="h-12 w-12 text-gray-300" />
          </div>
        )}
        {post.isFeatured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <span className="mr-1">★</span> Featured
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeColor(
              post.status
            )}`}
          >
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4 flex-grow">
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {truncateText(post.excerpt || post.content, 100)}
        </p>
      </div>

      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-6 w-6 relative rounded-full overflow-hidden mr-2">
              {post.author?.profilePicture ? (
                <Image
                  src={post.author.profilePicture}
                  alt={post.author?.name}
                  className="rounded-full"
                  fill
                  sizes="24px"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <FaUser className="h-3 w-3 text-gray-400" />
                </div>
              )}
            </div>
            <span>{post.author?.name || "Unknown"}</span>
          </div>
          <div className="flex items-center">
            <FaCalendarAlt className="h-3 w-3 mr-1" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <FaEye className="mr-1 h-3 w-3" />
            <span>{post.views || 0}</span>
          </div>
          <div className="flex items-center">
            <FaThumbsUp className="mr-1 h-3 w-3" />
            <span>{post.likes?.length || 0}</span>
          </div>
          <div className="flex items-center">
            <FaComment className="mr-1 h-3 w-3" />
            <span>{post.commentCount || 0}</span>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => toggleDropdown(post._id)}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaEllipsisV className="h-3 w-3" />
          </button>

          {activeDropdown === post._id && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-100">
              <div className="py-1">
                <Link
                  href={`/blogs/${post._id}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaEye className="mr-3 h-4 w-4" />
                  View Post
                </Link>
                <Link
                  href={`/admin/posts/edit/${post._id}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaEdit className="mr-3 h-4 w-4" />
                  Edit Post
                </Link>
                <button
                  onClick={() => openConfirmModal(post, "delete")}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FaTrash className="mr-3 h-4 w-4" />
                  Delete Post
                </button>

                {post.status === "pending" && (
                  <>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={() => openConfirmModal(post, "approve")}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-emerald-600 hover:bg-gray-100"
                    >
                      <FaCheck className="mr-3 h-4 w-4" />
                      Approve Post
                    </button>
                    <button
                      onClick={() => openConfirmModal(post, "reject")}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FaBan className="mr-3 h-4 w-4" />
                      Reject Post
                    </button>
                  </>
                )}

                {post.status === "published" && (
                  <>
                    <hr className="my-1 border-gray-100" />
                    {post.isFeatured ? (
                      <button
                        onClick={() => openConfirmModal(post, "unfeature")}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                      >
                        <span className="mr-3 text-lg">★</span>
                        Remove from Featured
                      </button>
                    ) : (
                      <button
                        onClick={() => openConfirmModal(post, "feature")}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100"
                      >
                        <span className="mr-3 text-lg">☆</span>
                        Add to Featured
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  // Render List View Row
  const renderListRow = (post) => (
    <motion.div
      variants={itemVariants}
      key={post._id}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 mb-4"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-32 sm:h-auto bg-gray-100">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              className="object-cover"
              fill
              sizes="(max-width: 640px) 100vw, 192px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaNewspaper className="h-12 w-12 text-gray-300" />
            </div>
          )}
          {post.isFeatured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-md text-xs font-medium">
              ★ Featured
            </div>
          )}
        </div>

        <div className="flex-1 p-4">
          <div className="flex items-center justify-between">
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                  post.status
                )}`}
              >
                {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
              </span>
              {post.categories && post.categories.length > 0 && (
                <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-800 border border-violet-200">
                  {post.categories[0].name}
                </span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              ID: {post._id.substring(0, 8)}...
            </div>
          </div>

          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {post.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {truncateText(post.excerpt || post.content, 150)}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <div className="flex-shrink-0 h-6 w-6 relative rounded-full overflow-hidden mr-2">
                {post.author?.profilePicture ? (
                  <Image
                    src={post.author.profilePicture}
                    alt={post.author?.name}
                    className="rounded-full"
                    fill
                    sizes="24px"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUser className="h-3 w-3 text-gray-400" />
                  </div>
                )}
              </div>
              <span className="mr-3">{post.author?.name || "Unknown"}</span>

              <div className="flex items-center ml-1">
                <FaCalendarAlt className="mr-1 h-3 w-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            <div className="flex space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <FaEye className="mr-1 h-3 w-3" />
                <span>{post.views || 0}</span>
              </div>
              <div className="flex items-center">
                <FaThumbsUp className="mr-1 h-3 w-3" />
                <span>{post.likes?.length || 0}</span>
              </div>
              <div className="flex items-center">
                <FaComment className="mr-1 h-3 w-3" />
                <span>{post.commentCount || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col justify-end border-t sm:border-t-0 sm:border-l border-gray-100 p-2 bg-gray-50">
          <Link
            href={`/blogs/${post._id}`}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="View post"
          >
            <FaEye className="h-4 w-4" />
          </Link>
          <Link
            href={`/admin/posts/edit/${post._id}`}
            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
            title="Edit post"
          >
            <FaEdit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => openConfirmModal(post, "delete")}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
            title="Delete post"
          >
            <FaTrash className="h-4 w-4" />
          </button>
          {post.status === "pending" && (
            <>
              <button
                onClick={() => openConfirmModal(post, "approve")}
                className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                title="Approve post"
              >
                <FaCheck className="h-4 w-4" />
              </button>
              <button
                onClick={() => openConfirmModal(post, "reject")}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Reject post"
              >
                <FaBan className="h-4 w-4" />
              </button>
            </>
          )}
          {post.status === "published" && (
            <>
              {post.isFeatured ? (
                <button
                  onClick={() => openConfirmModal(post, "unfeature")}
                  className="p-2 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 rounded transition-colors"
                  title="Remove from featured"
                >
                  <span className="text-lg leading-none">★</span>
                </button>
              ) : (
                <button
                  onClick={() => openConfirmModal(post, "feature")}
                  className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded transition-colors"
                  title="Add to featured"
                >
                  <span className="text-lg leading-none">☆</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 mt-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4">
              <div className="h-8 w-8 rounded-md flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                <FaArrowLeft className="h-4 w-4" />
              </div>
            </Link>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <FaNewspaper className="mr-2 h-5 w-5 text-blue-600" />
              Post Management
            </h1>
          </div>
          <Link
            href="/admin/posts/create"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 hover:shadow"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Messages */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              className="mb-4 bg-red-50 border border-red-100 p-4 rounded-lg shadow-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInVariants}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaTimesCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              className="mb-4 bg-green-50 border border-green-100 p-4 rounded-lg shadow-sm"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeInVariants}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <FaCheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="bg-white shadow-sm rounded-xl mb-6 overflow-hidden border border-gray-100">
          <div className="p-5">
            <form
              onSubmit={handleSearch}
              className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
            >
              <div className="flex-1">
                <div className="relative rounded-lg overflow-hidden shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-3 border-gray-200 rounded-lg"
                    placeholder="Search posts by title, content, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Search
                </button>
                <div className="relative">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <select
                        value={filterStatus}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg appearance-none"
                      >
                        <option value="all">All Posts</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <FaFilter className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="flex rounded-lg overflow-hidden border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${
                          viewMode === "grid"
                            ? "bg-gray-100 text-gray-900"
                            : "bg-white text-gray-500"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="3" y="3" width="7" height="7"></rect>
                          <rect x="14" y="3" width="7" height="7"></rect>
                          <rect x="14" y="14" width="7" height="7"></rect>
                          <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${
                          viewMode === "list"
                            ? "bg-gray-100 text-gray-900"
                            : "bg-white text-gray-500"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {filterStatus !== "all" && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-800 border border-blue-100">
              Status:{" "}
              {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              <button
                onClick={() => handleFilterChange("all")}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </div>
          )}

          {searchTerm && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-800 border border-blue-100">
              Search: {searchTerm}
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchPosts();
                }}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </div>
          )}

          {(filterStatus !== "all" || searchTerm) && (
            <button
              onClick={() => {
                setFilterStatus("all");
                setSearchTerm("");
                setCurrentPage(1);
                fetchPosts();
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Posts Grid/List View */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : posts.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(renderGridCard)}
              </div>
            ) : (
              <div className="space-y-4">{posts.map(renderListRow)}</div>
            )
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-10 text-center border border-gray-100">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FaNewspaper className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No posts found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setSearchTerm("");
                  fetchPosts();
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Filters
              </button>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm px-4 py-3 flex items-center justify-between border border-gray-100">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page{" "}
                  <span className="font-medium">{currentPage}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    &larr;
                  </button>
                  {[...Array(totalPages).keys()].map((page) => {
                    // Show limited page numbers with ellipsis for large page counts
                    if (
                      totalPages <= 7 ||
                      page === 0 ||
                      page === totalPages - 1 ||
                      (page >= currentPage - 2 && page <= currentPage)
                    ) {
                      return (
                        <button
                          key={page + 1}
                          onClick={() => handlePageChange(page + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === page + 1
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                          } text-sm font-medium`}
                        >
                          {page + 1}
                        </button>
                      );
                    } else if (
                      (page === 1 && currentPage > 4) ||
                      (page === totalPages - 2 && currentPage < totalPages - 3)
                    ) {
                      return (
                        <span
                          key={`ellipsis-${page}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 text-sm"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed z-30 inset-0 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.75 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </motion.div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", bounce: 0.25 }}
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div
                      className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                        modalAction === "delete" || modalAction === "reject"
                          ? "bg-red-100"
                          : modalAction === "approve"
                          ? "bg-emerald-100"
                          : "bg-blue-100"
                      }`}
                    >
                      {modalAction === "delete" ? (
                        <FaTrash className="h-6 w-6 text-red-600" />
                      ) : modalAction === "approve" ? (
                        <FaCheck className="h-6 w-6 text-emerald-600" />
                      ) : modalAction === "reject" ? (
                        <FaBan className="h-6 w-6 text-red-600" />
                      ) : (
                        <span className="text-xl text-yellow-500 font-bold">
                          ★
                        </span>
                      )}
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-headline"
                      >
                        {modalAction.charAt(0).toUpperCase() +
                          modalAction.slice(1)}{" "}
                        Post
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{modalMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={handleConfirmAction}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                      modalAction === "delete" || modalAction === "reject"
                        ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        : modalAction === "approve"
                        ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
                        : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                    }`}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside handler for dropdown menus */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}
