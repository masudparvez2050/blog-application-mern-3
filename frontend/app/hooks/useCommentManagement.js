import { useState, useEffect, useCallback } from "react";
import {
  fetchComments,
  updateCommentStatus,
  deleteComment,
} from "../services/commentService";
import { debounce } from "../utils/commentUtils";

const useCommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [actionResult, setActionResult] = useState({ message: "", type: "" });
  const [expandedComments, setExpandedComments] = useState({});

  // Setup debounced search with shorter delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // Reduced from 500ms to 300ms for faster response

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch comments with optimized memoization
  const getComments = useCallback(async () => {
    try {
      setIsLoading(true);
      if (searchTerm) setIsSearching(true);

      const response = await fetchComments({
        page: currentPage,
        limit: 10,
        search: debouncedSearchTerm,
        status: filterStatus === "all" ? "" : filterStatus, // Normalize filterStatus
        sort: sortOrder,
      });

      setComments(response.comments || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      setActionResult({
        message: error.message || "Failed to fetch comments",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [currentPage, filterStatus, debouncedSearchTerm, sortOrder, searchTerm]);

  // Trigger search only when debouncedSearchTerm changes or on initial load
  useEffect(() => {
    // Avoid fetching if search term is empty unless it's the initial load
    if (debouncedSearchTerm || currentPage === 1) {
      setCurrentPage(1); // Reset to page 1 on new search
      getComments();
    }
  }, [debouncedSearchTerm, getComments, currentPage]);

  // Fetch comments when filters or sorting change
  useEffect(() => {
    getComments();
  }, [currentPage, filterStatus, sortOrder, getComments]);

  // Handle search without additional debouncing
  const handleSearch = useCallback(
    (e) => {
      e?.preventDefault();
      setCurrentPage(1); // Reset to page 1 on explicit search
      getComments();
    },
    [getComments]
  );

  const handleFilterChange = useCallback((status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((order) => {
    setSortOrder(order);
    setCurrentPage(1);
  }, []);

  const toggleCommentExpand = useCallback((commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  const handleAction = useCallback(
    async (comment, action) => {
      try {
        if (action === "delete") {
          await deleteComment(comment._id);
        } else {
          await updateCommentStatus(comment._id, action);
        }

        setActionResult({
          message: `Comment ${action}ed successfully`,
          type: "success",
        });

        // Refresh comments
        getComments();
      } catch (error) {
        setActionResult({
          message: error.message || `Failed to ${action} comment`,
          type: "error",
        });
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setActionResult({ message: "", type: "" });
      }, 3000);
    },
    [getComments]
  );

  return {
    comments,
    isLoading,
    searchTerm,
    setSearchTerm,
    isSearching,
    currentPage,
    setCurrentPage,
    totalPages,
    filterStatus,
    sortOrder,
    actionResult,
    expandedComments,
    handlers: {
      handleSearch,
      handleFilterChange,
      handleSortChange,
      toggleCommentExpand,
      handleAction,
    },
  };
};

export default useCommentManagement;
