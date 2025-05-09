"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaUserShield,
  FaUser,
  FaEdit,
  FaTrash,
  FaLock,
  FaUnlock,
  FaArrowLeft,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
  FaUserPlus,
  FaTimesCircle,
  FaCheckCircle,
} from "react-icons/fa";

export default function UsersManagement() {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Set up debounce timeout ref
  const debounceTimeout = useRef(null);

  // Debounce function for search term
  const debounce = useCallback((value) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
      setCurrentPage(1); // Reset to first page when search term changes
    }, 500); // 500ms delay
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?page=${currentPage}&limit=10&sortField=${sortField}&sortDirection=${sortDirection}&search=${debouncedSearchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Failed to load users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortField, sortDirection, debouncedSearchTerm]);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login?redirect=/admin/users");
      return;
    }

    // Fetch users
    fetchUsers();
  }, [
    isAuthenticated,
    isAdmin,
    loading,
    router,
    currentPage,
    sortField,
    sortDirection,
    debouncedSearchTerm,
    fetchUsers,
  ]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setDebouncedSearchTerm(searchTerm);
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

  const openConfirmModal = (user, action) => {
    setSelectedUser(user);
    setModalAction(action);

    switch (action) {
      case "delete":
        setModalMessage(
          `Are you sure you want to delete the user ${user.name}? This action cannot be undone.`
        );
        break;
      case "activate":
        setModalMessage(
          `Are you sure you want to activate the account for ${user.name}?`
        );
        break;
      case "deactivate":
        setModalMessage(
          `Are you sure you want to deactivate the account for ${user.name}?`
        );
        break;
      case "makeAdmin":
        setModalMessage(
          `Are you sure you want to make ${user.name} an admin? This will give them full access to the admin dashboard.`
        );
        break;
      case "removeAdmin":
        setModalMessage(
          `Are you sure you want to remove admin privileges from ${user.name}?`
        );
        break;
      default:
        setModalMessage("Are you sure you want to perform this action?");
    }

    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser || !modalAction) return;

    try {
      const token = localStorage.getItem("token");
      let endpoint = "";
      let method = "PUT";

      switch (modalAction) {
        case "delete":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${selectedUser._id}`;
          method = "DELETE";
          break;
        case "activate":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${selectedUser._id}/activate`;
          break;
        case "deactivate":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${selectedUser._id}/deactivate`;
          break;
        case "makeAdmin":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${selectedUser._id}/role`;
          method = "PUT";
          break;
        case "removeAdmin":
          endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${selectedUser._id}/role`;
          method = "PUT";
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
        body:
          modalAction === "makeAdmin"
            ? JSON.stringify({ role: "admin" })
            : modalAction === "removeAdmin"
            ? JSON.stringify({ role: "user" })
            : null,
      });

      if (response.ok) {
        setSuccessMessage(
          `User ${
            modalAction === "delete"
              ? "deleted"
              : modalAction === "activate"
              ? "activated"
              : modalAction === "deactivate"
              ? "deactivated"
              : modalAction === "makeAdmin"
              ? "granted admin privileges"
              : "removed from admin role"
          } successfully.`
        );

        if (modalAction === "delete") {
          setUsers(users.filter((user) => user._id !== selectedUser._id));
        } else {
          fetchUsers();
        }
      } else {
        throw new Error("Failed to perform action");
      }
    } catch (error) {
      console.error(`Error ${modalAction} user:`, error);
      setErrorMessage(`Failed to ${modalAction} user. Please try again.`);
    } finally {
      setShowConfirmModal(false);
      setSelectedUser(null);
      setModalAction("");
    }
  };

  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage]);

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

  if (loading || (isLoading && users.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/admin" className="mr-4">
              <FaArrowLeft className="h-5 w-5 text-gray-600 hover:text-gray-900" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaUserShield className="mr-2 h-6 w-6 text-blue-600" />
              User Management
            </h1>
          </div>
          <Link
            href="/admin/users/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaUserPlus className="mr-2 h-4 w-4" />
            Add New User
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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

        <div className="bg-white shadow rounded-lg mb-6">
          <div className="p-6">
            <form
              onSubmit={handleSearch}
              className="flex items-center space-x-4"
            >
              <div className="flex-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md p-4"
                    placeholder="Search users by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setSearchTerm(newValue);
                      debounce(newValue);
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </form>
          </div>
        </div>

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
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      Email
                      {sortField === "email" &&
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
                    onClick={() => handleSort("role")}
                  >
                    <div className="flex items-center">
                      Role
                      {sortField === "role" &&
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
                    onClick={() => handleSort("isActive")}
                  >
                    <div className="flex items-center">
                      Status
                      {sortField === "isActive" &&
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
                      Joined
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
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <motion.tr key={user._id} variants={itemVariants}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative">
                            {user.profilePicture ? (
                              <Image
                                src={user.profilePicture}
                                alt={user.name}
                                className="rounded-full"
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <FaUser className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user._id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.isVerified ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Unverified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <FaUserShield className="mr-1 h-3 w-3" />
                          ) : (
                            <FaUser className="mr-1 h-3 w-3" />
                          )}
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/admin/users/edit/${user._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <FaEdit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => openConfirmModal(user, "delete")}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                          {user.isActive ? (
                            <button
                              onClick={() =>
                                openConfirmModal(user, "deactivate")
                              }
                              className="text-orange-600 hover:text-orange-900"
                              title="Deactivate user"
                            >
                              <FaLock className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => openConfirmModal(user, "activate")}
                              className="text-green-600 hover:text-green-900"
                              title="Activate user"
                            >
                              <FaUnlock className="h-5 w-5" />
                            </button>
                          )}
                          {user.role === "admin" ? (
                            <button
                              onClick={() =>
                                openConfirmModal(user, "removeAdmin")
                              }
                              className="text-purple-600 hover:text-purple-900"
                              title="Remove admin privileges"
                            >
                              <FaUserShield className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                openConfirmModal(user, "makeAdmin")
                              }
                              className="text-gray-600 hover:text-gray-900"
                              title="Make admin"
                            >
                              <FaUserShield className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      {isLoading ? "Loading users..." : "No users found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
                      modalAction === "delete"
                        ? "bg-red-100"
                        : modalAction === "activate"
                        ? "bg-green-100"
                        : modalAction === "deactivate"
                        ? "bg-orange-100"
                        : "bg-blue-100"
                    }`}
                  >
                    {modalAction === "delete" ? (
                      <FaTrash className="h-6 w-6 text-red-600" />
                    ) : modalAction === "activate" ? (
                      <FaUnlock className="h-6 w-6 text-green-600" />
                    ) : modalAction === "deactivate" ? (
                      <FaLock className="h-6 w-6 text-orange-600" />
                    ) : (
                      <FaUserShield className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      {modalAction.charAt(0).toUpperCase() +
                        modalAction.slice(1)}{" "}
                      User
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
                    modalAction === "delete"
                      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                      : modalAction === "activate"
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : modalAction === "deactivate"
                      ? "bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"
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
