"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
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
} from "react-icons/fa";

export default function AdminDashboard() {
  const { isAuthenticated, loading, isAdmin, logout } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    pendingPosts: 0,
    pendingComments: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        "http://localhost:5000/api/admin/dashboard",
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Format date for activity items
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "post":
        return <FaNewspaper className="h-5 w-5 text-blue-500" />;
      case "comment":
        return <FaCommentDots className="h-5 w-5 text-green-500" />;
      case "user":
        return <FaUser className="h-5 w-5 text-purple-500" />;
      default:
        return <FaBell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaUserShield className="mr-2 h-6 w-6 text-blue-600" />
            Admin Dashboard
          </h1>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaSignOutAlt className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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
              <div className="bg-white rounded-lg shadow p-4 hover:bg-blue-50 transition-colors duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FaUsers className="h-8 w-8" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">
                          {stats.totalUsers}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-blue-600 font-medium">
                      View All Users
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Posts Card */}
          <motion.div variants={itemVariants}>
            <Link href="/admin/posts" className="block">
              <div className="bg-white rounded-lg shadow p-4 hover:bg-blue-50 transition-colors duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FaNewspaper className="h-8 w-8" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Posts
                      </dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">
                          {stats.totalPosts}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-green-600 font-medium">
                      View All Posts
                    </div>
                    {stats.pendingPosts > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
              <div className="bg-white rounded-lg shadow p-4 hover:bg-blue-50 transition-colors duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FaComments className="h-8 w-8" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Comments
                      </dt>
                      <dd>
                        <div className="text-lg font-bold text-gray-900">
                          {stats.totalComments}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-purple-600 font-medium">
                      View All Comments
                    </div>
                    {stats.pendingComments > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
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
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <FaChartBar className="h-8 w-8" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Engagement Stats
                    </dt>
                    <dd>
                      <div className="flex mt-1">
                        <div className="flex items-center text-sm text-gray-500 mr-4">
                          <FaEye className="mr-1 h-4 w-4 text-gray-400" />
                          <span>4.2K views</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaThumbsUp className="mr-1 h-4 w-4 text-gray-400" />
                          <span>1.8K likes</span>
                        </div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-orange-600 font-medium">
                    View Analytics
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Access */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow rounded-lg mb-8"
        >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quick Access
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
            <motion.div variants={itemVariants}>
              <Link
                href="/admin/posts/create"
                className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-300"
              >
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <FaNewspaper className="h-6 w-6" />
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  New Post
                </div>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/admin/posts?status=pending"
                className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-300"
              >
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FaBell className="h-6 w-6" />
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  Pending Posts
                </div>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/admin/comments?status=pending"
                className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-300"
              >
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FaComments className="h-6 w-6" />
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  Pending Comments
                </div>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/admin/users"
                className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-300"
              >
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <FaUserShield className="h-6 w-6" />
                </div>
                <div className="mt-2 text-sm font-medium text-gray-900">
                  Manage Users
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="px-6 py-4 flex items-start"
                >
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </div>
                    <div className="mt-1 text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-1 h-3 w-3" />
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                  {activity.link && (
                    <div className="ml-4">
                      <Link
                        href={activity.link}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No recent activity found.</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
