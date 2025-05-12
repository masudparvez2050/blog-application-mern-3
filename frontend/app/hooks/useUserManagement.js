import { useState, useEffect, useCallback, useRef } from "react";
import { fetchUsers, updateUserStatus } from "../services/userManagementService";
import { debounce } from "../utils/userManagementUtils";

export const useUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Set up debounce timeout ref
  const debounceTimeout = useRef(null);

  // Debounce search term changes
  const handleSearchChange = useCallback(
    (value) => {
      setSearchTerm(value);
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        setDebouncedSearchTerm(value);
        setCurrentPage(1);
      }, 500);
    },
    []
  );

  // Handle sorting
  const handleSort = useCallback((field) => {
    setSortDirection((prevDirection) =>
      field === sortField
        ? prevDirection === "asc"
          ? "desc"
          : "asc"
        : "asc"
    );
    setSortField(field);
  }, [sortField]);

  // Fetch users data
  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      const data = await fetchUsers({
        page: currentPage,
        sortField,
        sortDirection,
        search: debouncedSearchTerm,
        token,
      });
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error loading users:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortField, sortDirection, debouncedSearchTerm]);

  // Handle user actions (delete, activate, deactivate, etc.)
  const handleUserAction = useCallback(async (user, action) => {
    try {
      setError("");
      const token = localStorage.getItem("token");
      await updateUserStatus({ userId: user._id, action, token });
      
      if (action === "delete") {
        setUsers((prevUsers) => prevUsers.filter((u) => u._id !== user._id));
      } else {
        loadUsers();
      }

      setSuccessMessage(
        `User ${
          action === "delete"
            ? "deleted"
            : action === "activate"
            ? "activated"
            : action === "deactivate"
            ? "deactivated"
            : action === "makeAdmin"
            ? "granted admin privileges"
            : "removed from admin role"
        } successfully.`
      );
    } catch (err) {
      setError(`Failed to ${action} user. Please try again.`);
      console.error(`Error ${action} user:`, err);
    }
  }, [loadUsers]);

  // Load users on mount and when dependencies change
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Clear messages after delay
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        setError("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return {
    users,
    isLoading,
    searchTerm,
    sortField,
    sortDirection,
    currentPage,
    totalPages,
    error,
    successMessage,
    setCurrentPage,
    handleSearchChange,
    handleSort,
    handleUserAction,
  };
};
