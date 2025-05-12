"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUsers,
  FaNewspaper,
  FaComments,
  FaUserShield,
  FaUser,
  FaSignOutAlt,
  FaChartBar,
  FaCalendarAlt,
  FaBell,
  FaEye,
  FaThumbsUp,
  FaCommentDots,
  FaSearch,
  FaPlus,
  FaRegClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCog,
  FaTachometerAlt,
  FaSlidersH,
  FaBook,
  FaTag,
} from "react-icons/fa";

export default function AdminDashboard() {
  const { isAuthenticated, loading, isAdmin, logout, user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    pendingPosts: 0,
    pendingComments: 0,
    totalViews: 0,
    totalLikes: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login?redirect=/admin");
      return;
    }

    // Fetch dashboard stats
    fetchDashboardStats();
  }, [isAuthenticated, isAdmin, loading, router]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error("Failed to fetch dashboard statistics");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
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
        damping: 15,
      },
    },
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="relative flex flex-col items-center justify-center">
          <div className="h-14 w-14 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
          <div className="absolute top-0 left-16  h-14 w-14 rounded-full border-r-4 border-l-4 border-indigo-300 animate-pulse"></div>
          <p className="mt-4 text-center text-indigo-600 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Format date for activity items
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format time ago for activity items
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMinutes}m ago`;
  };

  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "post":
        return <FaNewspaper className="h-5 w-5 text-blue-600" />;
      case "comment":
        return <FaCommentDots className="h-5 w-5 text-green-600" />;
      case "user":
        return <FaUser className="h-5 w-5 text-purple-600" />;
      default:
        return <FaBell className="h-5 w-5 text-gray-600" />;
    }
  };

  // Get badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "draft":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calculate growth percentages for the dashboard (sample)
  const growthData = {
    users: 12.5,
    posts: 8.3,
    comments: 15.2,
    views: -2.4,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/20 to-white ">
      {/* Header */}

      <main className="  ">
        {/* Welcome section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Good {timeOfDay},{" "}
                  {user?.name?.split(" ")[0] || "Administrator"}
                </h2>
                <p className="mt-1 text-gray-500">
                  Welcome to your admin dashboard. Here&apos;s what&apos;s
                  happening today.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  href="/admin/posts/create"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  <FaPlus className="mr-1.5 h-4 w-4" />
                  New Post
                </Link>
                {/* <Link
                  href="/admin/settings"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  <FaCog className="mr-1.5 h-4 w-4" />
                  Settings
                </Link> */}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {/* Users Card */}
          <motion.div variants={itemVariants}>
            <Link href="/admin/users" className="block">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-indigo-50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                    <FaUsers className="h-7 w-7" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.totalUsers}
                        </div>
                        {growthData.users !== 0 && (
                          <span
                            className={`ml-2 text-xs font-medium ${
                              growthData.users > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {growthData.users > 0 ? "+" : ""}
                            {growthData.users}%
                          </span>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-indigo-600 font-medium group-hover:text-indigo-700 transition-colors flex items-center">
                      View All Users
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Posts Card */}
          <motion.div variants={itemVariants}>
            <Link href="/admin/posts" className="block">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-indigo-50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                    <FaNewspaper className="h-7 w-7" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Posts
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.totalPosts}
                        </div>
                        {growthData.posts !== 0 && (
                          <span
                            className={`ml-2 text-xs font-medium ${
                              growthData.posts > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {growthData.posts > 0 ? "+" : ""}
                            {growthData.posts}%
                          </span>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-600 font-medium group-hover:text-blue-700 transition-colors flex items-center">
                      View All Posts
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {stats.pendingPosts > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        {stats.pendingPosts} pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Comments Card */}
          <motion.div variants={itemVariants}>
            <Link href="/admin/comments" className="block">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-indigo-50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                    <FaComments className="h-7 w-7" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Comments
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">
                          {stats.totalComments}
                        </div>
                        {growthData.comments !== 0 && (
                          <span
                            className={`ml-2 text-xs font-medium ${
                              growthData.comments > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {growthData.comments > 0 ? "+" : ""}
                            {growthData.comments}%
                          </span>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-green-600 font-medium group-hover:text-green-700 transition-colors flex items-center">
                      View All Comments
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {stats.pendingComments > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                        {stats.pendingComments} pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Stats Card */}
          <motion.div variants={itemVariants}>
            <Link href="/admin/analytics" className="block">
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 border border-indigo-50 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                    <FaChartBar className="h-7 w-7" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Engagement Stats
                      </dt>
                      <dd>
                        <div className="flex mt-1 items-center">
                          <div className="flex items-center text-sm text-gray-600 mr-4">
                            <FaEye className="mr-1 h-4 w-4 text-gray-500" />
                            <span>{stats.totalViews}</span>
                            {growthData.views !== 0 && (
                              <span
                                className={`ml-1 text-xs font-medium ${
                                  growthData.views > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {growthData.views > 0 ? "+" : ""}
                                {growthData.views}%
                              </span>
                            )}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <FaThumbsUp className="mr-1 h-4 w-4 text-gray-500" />
                            <span>{stats.totalLikes}</span>
                          </div>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-purple-600 font-medium group-hover:text-purple-700 transition-colors flex items-center">
                      View Analytics
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Middle section: Alert + Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Alerts & Notifications */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 border border-indigo-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FaBell className="mr-2 h-5 w-5 text-amber-500" />
                Alerts & Notifications
              </h3>

              <div className="space-y-4">
                {/* Alert items */}
                {stats.pendingPosts > 0 && (
                  <div className="flex items-start p-3 bg-amber-50 border border-amber-100 rounded-lg">
                    <div className="flex-shrink-0">
                      <FaExclamationTriangle className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-amber-800">
                        {stats.pendingPosts} pending posts require approval
                      </h4>
                      <div className="mt-2 flex">
                        <Link
                          href="/admin/posts?status=pending"
                          className="text-xs text-amber-800 font-medium hover:text-amber-900"
                        >
                          Review now →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {stats.pendingComments > 0 && (
                  <div className="flex items-start p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <div className="flex-shrink-0">
                      <FaCommentDots className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">
                        {stats.pendingComments} comments waiting for moderation
                      </h4>
                      <div className="mt-2 flex">
                        <Link
                          href="/admin/comments?status=pending"
                          className="text-xs text-blue-800 font-medium hover:text-blue-900"
                        >
                          Moderate comments →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* When nothing pending */}
                {stats.pendingPosts === 0 && stats.pendingComments === 0 && (
                  <div className="flex items-start p-3 bg-green-50 border border-green-100 rounded-lg">
                    <div className="flex-shrink-0">
                      <FaCheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-green-800">
                        All items have been reviewed
                      </h4>
                      <p className="text-xs text-green-700 mt-1">
                        There are no pending posts or comments that require your
                        attention.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Access Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 bg-white shadow-md rounded-xl border border-indigo-50 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <FaSlidersH className="mr-2 h-5 w-5 text-indigo-600" />
                Quick Actions
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6">
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="/admin/posts/create"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all border border-blue-100"
                >
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FaPlus className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    New Post
                  </div>
                </Link>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="/admin/posts?status=pending"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl hover:shadow-md transition-all border border-amber-100"
                >
                  <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                    <FaRegClock className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    Pending Posts
                  </div>
                </Link>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="/admin/comments?status=pending"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all border border-green-100"
                >
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaComments className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    Pending Comments
                  </div>
                </Link>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="/admin/users"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl hover:shadow-md transition-all border border-purple-100"
                >
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FaUsers className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    Manage Users
                  </div>
                </Link>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="/admin/analytics"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl hover:shadow-md transition-all border border-cyan-100"
                >
                  <div className="p-3 rounded-full bg-cyan-100 text-cyan-600">
                    <FaChartBar className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    View Analytics
                  </div>
                </Link>
              </motion.div>
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link
                  href="/admin/category"
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl hover:shadow-md transition-all border border-gray-100"
                >
                  <div className="p-3 rounded-full bg-gray-100 text-gray-600">
                    <FaTag className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-sm font-medium text-gray-900">
                    Categories
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow-md rounded-xl border border-indigo-50 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FaBook className="mr-2 h-5 w-5 text-indigo-600" />
              Recent Activity
            </h3>
            <Link
              href="/admin/analytics"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              View all
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id || index}
                  variants={itemVariants}
                  className="px-6 py-4 hover:bg-indigo-50/30 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.type === "post"
                            ? `${activity.user} published a post`
                            : `${activity.user} commented on a post`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getTimeAgo(activity.date)}
                        </div>
                      </div>
                      <div className="mt-1">
                        {activity.type === "post" ? (
                          <p className="text-sm text-gray-700">
                            &quot;{activity.title}&quot;
                          </p>
                        ) : (
                          <>
                            <p className="text-xs text-gray-500 mb-1">
                              on &quot;{activity.post}&quot;
                            </p>
                            <p className="text-sm text-gray-700">
                              &quot;{activity.content}&quot;
                            </p>
                          </>
                        )}
                      </div>
                      <div className="mt-2 flex items-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(
                            activity.status
                          )}`}
                        >
                          {activity.status || "published"}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 flex items-center">
                          <FaCalendarAlt className="mr-1 h-3 w-3" />
                          {formatDate(activity.date)}
                        </span>
                        <div className="ml-auto">
                          <Link
                            href={
                              activity.type === "post"
                                ? `/blogs/${activity.id}`
                                : `/blogs/${activity.postId}#comment-${activity.id}`
                            }
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            <FaEye className="mr-1 h-3 w-3" /> View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-6 py-10 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
                <p className="mt-4 text-gray-500 text-base">
                  No recent activity found.
                </p>
                <p className="mt-2 text-gray-400 text-sm">
                  Check back later for updates or create some activity yourself!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
