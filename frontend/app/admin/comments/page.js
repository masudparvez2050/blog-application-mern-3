"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaCheck,
  FaTimes,
  FaSearch,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaEye,
  FaFlag,
  FaSpinner,
  FaFilter,
<<<<<<< HEAD
  FaSort,
=======
>>>>>>> 315e87c (:message)
  FaCommentAlt,
  FaChevronDown,
  FaChevronRight,
  FaExclamationTriangle,
} from "react-icons/fa";
<<<<<<< HEAD
=======
import { getContainerVariants, getItemVariants } from "@/app/utils/animation";


const containerVariants = getContainerVariants(0.5); // custom stagger
const itemVariants = getItemVariants({ y: 20, duration: 0.8 }); // custom values
>>>>>>> 315e87c (:message)

// Debounce utility function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default function CommentManagement() {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedComment, setSelectedComment] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionResult, setActionResult] = useState({ message: "", type: "" });
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [expandedComments, setExpandedComments] = useState({});

  const commentsPerPage = 10;

  // Setup debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoading(true);
      if (searchTerm) {
        setIsSearching(true);
      }
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: commentsPerPage,
        search: debouncedSearchTerm,
        status: filterStatus !== "all" ? filterStatus : "",
        sort: sortOrder,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/admin?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setComments(data.comments);
        setTotalPages(data.totalPages || 1);
      } else {
        throw new Error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setActionResult({
        message: error.message || "An error occurred while fetching comments",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [
    currentPage,
    filterStatus,
    debouncedSearchTerm,
    commentsPerPage,
    searchTerm,
    sortOrder,
  ]);

  // Trigger search when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      setCurrentPage(1);
      fetchComments();
    }
  }, [debouncedSearchTerm, fetchComments]);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login?redirect=/admin/comments");
      return;
    }

    // Fetch comments
    fetchComments();
  }, [
    isAuthenticated,
    isAdmin,
    loading,
    router,
    currentPage,
    filterStatus,
    sortOrder,
    fetchComments,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComments();
  };

  const handleConfirmAction = (comment, action) => {
    setSelectedComment(comment);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const handleCancelAction = () => {
    setSelectedComment(null);
    setActionType(null);
    setShowConfirmModal(false);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const toggleCommentExpand = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const executeAction = async () => {
    if (!selectedComment || !actionType) return;

    const token = localStorage.getItem("token");
    let endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${selectedComment._id}`;
    let method = "PUT";
    let body = {};

    switch (actionType) {
      case "approve":
        body = { isApproved: true };
        break;
      case "reject":
        body = { isApproved: false };
        break;
      case "delete":
        method = "DELETE";
        break;
      default:
        return;
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: method !== "DELETE" ? JSON.stringify(body) : undefined,
      });

      if (response.ok) {
        const actionMessages = {
          approve: "Comment approved successfully",
          reject: "Comment rejected successfully",
          delete: "Comment deleted successfully",
        };

        setActionResult({
          message: actionMessages[actionType],
          type: "success",
        });

        // Refresh the comment list
        fetchComments();
      } else {
        const data = await response.json();
        throw new Error(data.message || "Action failed");
      }
    } catch (error) {
      console.error(`Error executing ${actionType} action:`, error);
      setActionResult({
        message: error.message || `Failed to execute ${actionType} action`,
        type: "error",
      });
    } finally {
      setShowConfirmModal(false);
      setSelectedComment(null);
      setActionType(null);

      // Auto-hide success message after 3 seconds
      if (actionType) {
        setTimeout(() => {
          setActionResult({ message: "", type: "" });
        }, 3000);
      }
    }
  };

<<<<<<< HEAD
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
=======

>>>>>>> 315e87c (:message)

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const getStatusBadge = (comment) => {
    if (comment.isApproved === true) {
      return (
        <span className="ml-2 px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          <FaCheck className="mr-1 h-3 w-3" />
          Approved
        </span>
      );
    } else if (comment.isApproved === false) {
      return (
        <span className="ml-2 px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          <FaTimes className="mr-1 h-3 w-3" />
          Rejected
        </span>
      );
    } else {
      return (
        <span className="ml-2 px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <FaExclamationTriangle className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-blue-600 font-medium">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Link
              href="/admin"
              className="group mr-4 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <div className="p-2 rounded-full bg-white shadow-sm group-hover:bg-blue-50 transition-colors">
                <FaArrowLeft className="h-5 w-5" />
              </div>
              <span className="ml-2 font-medium">Back to Admin</span>
            </Link>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
              <FaCommentAlt className="h-8 w-8 text-blue-600 mr-3" />
              <span>Comment Management</span>
            </h1>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3 mb-4"
          >
            <div className="relative rounded-lg shadow-sm flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search comments by content, author or post..."
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-200 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {isSearching ? (
                    <FaSpinner className="animate-spin h-4 w-4 text-gray-400" />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setDebouncedSearchTerm("");
                        fetchComments();
                      }}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="flex-shrink-0 inline-flex items-center px-5 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              <FaFilter className="mr-2 h-4 w-4" />
              Filters
              {showFilters ? (
                <FaChevronDown className="ml-2 h-3 w-3" />
              ) : (
                <FaChevronRight className="ml-2 h-3 w-3" />
              )}
            </button>

            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort:</span>
              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border-gray-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="flagged">Flagged First</option>
              </select>
            </div>
          </div>

          {/* Status Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Filter by status:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleFilterChange("all")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        filterStatus === "all"
                          ? "bg-gray-800 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All Comments
                    </button>
                    <button
                      onClick={() => handleFilterChange("approved")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        filterStatus === "approved"
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      <FaCheck className="mr-1 h-3 w-3" />
                      Approved
                    </button>
                    <button
                      onClick={() => handleFilterChange("pending")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        filterStatus === "pending"
                          ? "bg-yellow-500 text-white shadow-md"
                          : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                      }`}
                    >
                      <FaExclamationTriangle className="mr-1 h-3 w-3" />
                      Pending
                    </button>
                    <button
                      onClick={() => handleFilterChange("rejected")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        filterStatus === "rejected"
                          ? "bg-red-600 text-white shadow-md"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      <FaTimes className="mr-1 h-3 w-3" />
                      Rejected
                    </button>
                    <button
                      onClick={() => handleFilterChange("flagged")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center ${
                        filterStatus === "flagged"
                          ? "bg-orange-500 text-white shadow-md"
                          : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                      }`}
                    >
                      <FaFlag className="mr-1 h-3 w-3" />
                      Flagged
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Result Notification */}
        <AnimatePresence>
          {actionResult.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-lg shadow-sm border-l-4 ${
                actionResult.type === "success"
                  ? "bg-green-50 border-green-500 text-green-700"
                  : "bg-red-50 border-red-500 text-red-700"
              }`}
            >
              <div className="flex items-center">
                {actionResult.type === "success" ? (
                  <FaCheck className="h-5 w-5 mr-3" />
                ) : (
                  <FaExclamationTriangle className="h-5 w-5 mr-3" />
                )}
                <p>{actionResult.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100"
        >
          {comments.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              <AnimatePresence>
                {comments.map((comment) => (
                  <motion.li
                    key={comment._id}
                    variants={itemVariants}
                    exit={{ opacity: 0, height: 0 }}
                    className={`hover:bg-blue-50 transition-colors ${
                      comment.isFlagged ? "bg-orange-50" : ""
                    }`}
                  >
                    <div className="px-6 py-5">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <FaUser className="h-5 w-5" />
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {comment.author?.name || "Anonymous"}
                                </div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <FaCalendarAlt className="mr-1 h-3 w-3" />
                                  <span>
                                    {new Date(
                                      comment.createdAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {getStatusBadge(comment)}

                            {comment.isFlagged && (
                              <span className="px-2 py-1 inline-flex items-center text-xs leading-4 font-medium rounded-full bg-orange-100 text-orange-800">
                                <FaFlag className="mr-1 h-3 w-3" />
                                Flagged
                              </span>
                            )}
                          </div>

                          <div className="ml-2 flex-shrink-0 flex items-center space-x-1">
                            <Link
                              href={`/blogs/${comment.post?._id}`}
                              className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                              title="View on Post"
                            >
                              <FaEye className="h-4 w-4" />
                            </Link>
                            {comment.isApproved !== true && (
                              <button
                                onClick={() =>
                                  handleConfirmAction(comment, "approve")
                                }
                                className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                                title="Approve Comment"
                              >
                                <FaCheck className="h-4 w-4" />
                              </button>
                            )}
                            {comment.isApproved !== false && (
                              <button
                                onClick={() =>
                                  handleConfirmAction(comment, "reject")
                                }
                                className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all"
                                title="Reject Comment"
                              >
                                <FaTimes className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                handleConfirmAction(comment, "delete")
                              }
                              className="inline-flex items-center p-2 border border-transparent rounded-lg shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                              title="Delete Comment"
                            >
                              <FaTrash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-1">
                          <div
                            className="p-4 bg-gray-50 rounded-lg"
                            onClick={() => toggleCommentExpand(comment._id)}
                          >
                            <div className="flex justify-between cursor-pointer">
                              <p className="text-gray-800 whitespace-pre-wrap">
                                {expandedComments[comment._id]
                                  ? comment.content
                                  : truncateText(comment.content, 150)}
                              </p>
                              {comment.content.length > 150 && (
                                <button className="ml-2 text-blue-500 hover:text-blue-700 flex items-center text-xs font-medium">
                                  {expandedComments[comment._id] ? (
                                    <>
                                      Show less{" "}
                                      <FaChevronDown className="ml-1" />
                                    </>
                                  ) : (
                                    <>
                                      Show more{" "}
                                      <FaChevronRight className="ml-1" />
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-600">
                          <span className="font-medium">Post:</span>{" "}
                          <Link
                            href={`/blogs/${comment.post?._id}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {comment.post?.title || "Unknown Post"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          ) : (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center py-16 px-4 text-center"
            >
              <FaCommentAlt className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-1">
                No comments found
              </h3>
              <p className="text-gray-500 max-w-sm">
                Try adjusting your search or filters to find what you&apos;re looking
                for.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => {
                // Only show 5 page buttons at a time with ellipsis
                if (
                  totalPages <= 7 ||
                  idx === 0 ||
                  idx === totalPages - 1 ||
                  (currentPage - 3 <= idx && idx <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium transition-colors ${
                        currentPage === idx + 1
                          ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                } else if (idx === 1 || idx === totalPages - 2) {
                  return (
                    <span
                      key={idx}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirmModal && selectedComment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                  onClick={handleCancelAction}
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                >
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div
                        className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                          actionType === "delete"
                            ? "bg-red-100"
                            : actionType === "approve"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                        }`}
                      >
                        {actionType === "delete" ? (
                          <FaTrash
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        ) : actionType === "approve" ? (
                          <FaCheck
                            className="h-6 w-6 text-green-600"
                            aria-hidden="true"
                          />
                        ) : (
                          <FaTimes
                            className="h-6 w-6 text-yellow-600"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {actionType === "delete"
                            ? "Delete Comment"
                            : actionType === "approve"
                            ? "Approve Comment"
                            : "Reject Comment"}
                        </h3>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {actionType === "delete"
                              ? "Are you sure you want to delete this comment? This action cannot be undone."
                              : actionType === "approve"
                              ? "Are you sure you want to approve this comment? It will be visible to all users."
                              : "Are you sure you want to reject this comment? It will be hidden from users."}
                          </p>
                          <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm">
                            <p className="font-medium text-gray-700 mb-1">
                              Comment content:
                            </p>
                            <p className="text-gray-600 whitespace-pre-wrap">
                              {selectedComment.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm transition-colors ${
                        actionType === "delete"
                          ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                          : actionType === "approve"
                          ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                          : "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
                      }`}
                      onClick={executeAction}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                      onClick={handleCancelAction}
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
