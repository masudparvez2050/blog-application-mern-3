"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
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

  const openConfirmModal = (post, action) => {
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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Truncate text
  const truncateText = (text, length = 100) => {
    if (!text) return "";
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  if (loading || (isLoading && posts.length === 0)) {
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
            <Link href="/admin" className="mr-4">
              <FaArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaNewspaper className="mr-2 h-6 w-6 text-blue-600" />
              Post Management
            </h1>
          </div>
          <Link
            href="/admin/posts/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
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
                <FaCheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <form
              onSubmit={handleSearch}
              className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
            >
              <div className="flex-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search posts by title, content, or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Search
                </button>
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="all">All Posts</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Posts Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort("title")}
                    >
                      Post
                      {sortField === "title" &&
                        (sortDirection === "asc" ? (
                          <FaSortAmountUp className="ml-1 h-3 w-3" />
                        ) : (
                          <FaSortAmountDown className="ml-1 h-3 w-3" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort("author")}
                    >
                      Author
                      {sortField === "author" &&
                        (sortDirection === "asc" ? (
                          <FaSortAmountUp className="ml-1 h-3 w-3" />
                        ) : (
                          <FaSortAmountDown className="ml-1 h-3 w-3" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status
                      {sortField === "status" &&
                        (sortDirection === "asc" ? (
                          <FaSortAmountUp className="ml-1 h-3 w-3" />
                        ) : (
                          <FaSortAmountDown className="ml-1 h-3 w-3" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Date
                      {sortField === "createdAt" &&
                        (sortDirection === "asc" ? (
                          <FaSortAmountUp className="ml-1 h-3 w-3" />
                        ) : (
                          <FaSortAmountDown className="ml-1 h-3 w-3" />
                        ))}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stats
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <motion.tr key={post._id} variants={itemVariants}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 relative">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              className="rounded-md object-cover"
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-md bg-gray-200 flex items-center justify-center">
                              <FaNewspaper className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                          {post.isFeatured && (
                            <div className="absolute -top-1 -right-1 h-5 w-5 bg-yellow-400 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                ★
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 mt-1 max-w-md">
                            {truncateText(post.excerpt || post.content, 80)}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex items-center">
                            <span className="mr-2">
                              ID: {post._id.substring(0, 8)}...
                            </span>
                            {post.categories && post.categories.length > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {post.categories[0].name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 relative">
                          {post.author?.profilePicture ? (
                            <Image
                              src={post.author.profilePicture}
                              alt={post.author.name}
                              className="rounded-full"
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {post.author?.name || "Unknown Author"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          post.status
                        )}`}
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex flex-col">
                        <div className="flex items-center text-xs">
                          <FaCalendarAlt className="mr-1 h-3 w-3" />
                          <span>Created: {formatDate(post.createdAt)}</span>
                        </div>
                        {post.updatedAt &&
                          post.updatedAt !== post.createdAt && (
                            <div className="flex items-center text-xs mt-1">
                              <FaClock className="mr-1 h-3 w-3" />
                              <span>Updated: {formatDate(post.updatedAt)}</span>
                            </div>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <div className="flex items-center">
                          <FaEye className="mr-1 h-3 w-3 text-gray-400" />
                          <span>{post.views || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <FaThumbsUp className="mr-1 h-3 w-3 text-gray-400" />
                          <span>{post.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center">
                          <FaComment className="mr-1 h-3 w-3 text-gray-400" />
                          <span>{post.comments?.length || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/blogs/${post._id}`}
                          className="text-gray-600 hover:text-gray-900"
                          title="View post"
                        >
                          <FaEye className="h-5 w-5" />
                        </Link>
                        <Link
                          href={`/admin/posts/edit/${post._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit post"
                        >
                          <FaEdit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => openConfirmModal(post, "delete")}
                          className="text-red-600 hover:text-red-900"
                          title="Delete post"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                        {post.status === "pending" && (
                          <>
                            <button
                              onClick={() => openConfirmModal(post, "approve")}
                              className="text-green-600 hover:text-green-900"
                              title="Approve post"
                            >
                              <FaCheck className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => openConfirmModal(post, "reject")}
                              className="text-red-600 hover:text-red-900"
                              title="Reject post"
                            >
                              <FaBan className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        {post.status === "published" && (
                          <>
                            {post.isFeatured ? (
                              <button
                                onClick={() =>
                                  openConfirmModal(post, "unfeature")
                                }
                                className="text-yellow-500 hover:text-yellow-700"
                                title="Remove from featured"
                              >
                                <span className="font-bold text-xl leading-none">
                                  ★
                                </span>
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  openConfirmModal(post, "feature")
                                }
                                className="text-gray-400 hover:text-yellow-500"
                                title="Add to featured"
                              >
                                <span className="font-bold text-xl leading-none">
                                  ★
                                </span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {posts.length === 0 && !isLoading && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No posts found. Try adjusting your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      <span className="sr-only">Previous</span>
                      &larr;
                    </button>
                    {[...Array(totalPages).keys()].map((page) => (
                      <button
                        key={page + 1}
                        onClick={() => handlePageChange(page + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === page + 1
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
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
        </motion.div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div
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
                        ? "bg-green-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {modalAction === "delete" ? (
                      <FaTrash className="h-6 w-6 text-red-600" />
                    ) : modalAction === "approve" ? (
                      <FaCheck className="h-6 w-6 text-green-600" />
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
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    modalAction === "delete" || modalAction === "reject"
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      : modalAction === "approve"
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
