"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
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
} from "react-icons/fa";

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
    }
  };

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

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/admin" className="mr-4">
              <FaArrowLeft className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Comment Management
            </h1>
          </div>
          <form onSubmit={handleSearch} className="flex">
            <div className="relative rounded-md shadow-sm flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search comments..."
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md p-2"
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
              className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                  Searching...
                </>
              ) : (
                <>Search</>
              )}
            </button>
          </form>
        </div>

        {/* Status Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filterStatus === "all"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("approved")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filterStatus === "approved"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => handleFilterChange("pending")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filterStatus === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleFilterChange("rejected")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filterStatus === "rejected"
                ? "bg-red-600 text-white"
                : "bg-red-100 text-red-800 hover:bg-red-200"
            }`}
          >
            Rejected
          </button>
          <button
            onClick={() => handleFilterChange("flagged")}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              filterStatus === "flagged"
                ? "bg-orange-600 text-white"
                : "bg-orange-100 text-orange-800 hover:bg-orange-200"
            }`}
          >
            Flagged
          </button>
        </div>

        {actionResult.message && (
          <div
            className={`mb-6 p-4 rounded-md ${
              actionResult.type === "success"
                ? "bg-green-50 border-l-4 border-green-500 text-green-700"
                : "bg-red-50 border-l-4 border-red-500 text-red-700"
            }`}
          >
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm">{actionResult.message}</p>
              </div>
            </div>
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow overflow-hidden sm:rounded-md"
        >
          <ul className="divide-y divide-gray-200">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <motion.li
                  key={comment._id}
                  variants={itemVariants}
                  className={`hover:bg-gray-50 ${
                    comment.isFlagged ? "bg-orange-50" : ""
                  }`}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="text-sm font-medium text-blue-600 mr-2">
                            {comment.author?.name || "Anonymous"}
                          </div>
                          <span className="text-xs text-gray-500">
                            commented on post:{" "}
                            <Link
                              href={`/blogs/${comment.post?._id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {comment.post?.title || "Unknown Post"}
                            </Link>
                          </span>
                          {comment.isApproved === true && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Approved
                            </span>
                          )}
                          {comment.isApproved === false && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Rejected
                            </span>
                          )}
                          {comment.isApproved === null && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                          {comment.isFlagged && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                              <FaFlag className="mr-1 h-3 w-3" />
                              Flagged
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap mb-2">
                          {comment.content}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <FaCalendarAlt className="mr-1 h-3 w-3" />
                          <span>
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 items-center">
                        <Link
                          href={`/blogs/${comment.post?._id}`}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          title="View on Post"
                        >
                          <FaEye className="h-4 w-4" />
                        </Link>
                        {comment.isApproved !== true && (
                          <button
                            onClick={() =>
                              handleConfirmAction(comment, "approve")
                            }
                            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                            className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            title="Reject Comment"
                          >
                            <FaTimes className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleConfirmAction(comment, "delete")}
                          className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          title="Delete Comment"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-gray-500">
                <p className="text-xl">No comments found.</p>
                <p className="mt-2">Try adjusting your search or filters.</p>
              </li>
            )}
          </ul>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === idx + 1
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && selectedComment && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
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

              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
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
                        <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                          <p className="font-medium text-gray-700">
                            Comment content:
                          </p>
                          <p className="text-gray-600 mt-1">
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
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                      actionType === "delete"
                        ? "bg-red-600 hover:bg-red-700"
                        : actionType === "approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-yellow-600 hover:bg-yellow-700"
                    }`}
                    onClick={executeAction}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCancelAction}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
