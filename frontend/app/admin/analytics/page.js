"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaNewspaper,
  FaComments,
  FaUserShield,
  FaArrowLeft,
  FaEye,
  FaThumbsUp,
  FaCalendarAlt,
  FaChartBar,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminAnalytics() {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const router = useRouter();

  const [analytics, setAnalytics] = useState({
    postsPerMonth: [],
    commentsPerMonth: [],
    usersPerMonth: [],
    viewsPerMonth: [],
    likesPerMonth: [],
    topPosts: [],
    categoryStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // month, quarter, year

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login?redirect=/admin/analytics");
      return;
    }

    // Fetch analytics data
    fetchAnalytics(timeRange);
  }, [isAuthenticated, isAdmin, loading, router, timeRange]);

  const fetchAnalytics = async (range) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics?timeRange=${range}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        throw new Error("Failed to fetch analytics data");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Format labels for charts (months)
  const labels = analytics.postsPerMonth?.map((item) => item.month) || [];

  // Chart data for content growth
  const contentGrowthData = {
    labels,
    datasets: [
      {
        label: "Posts",
        data: analytics.postsPerMonth?.map((item) => item.count) || [],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        tension: 0.3,
      },
      {
        label: "Comments",
        data: analytics.commentsPerMonth?.map((item) => item.count) || [],
        borderColor: "rgb(147, 51, 234)",
        backgroundColor: "rgba(147, 51, 234, 0.5)",
        tension: 0.3,
      },
      {
        label: "Users",
        data: analytics.usersPerMonth?.map((item) => item.count) || [],
        borderColor: "rgb(16, 185, 129)",
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        tension: 0.3,
      },
    ],
  };

  // Chart data for engagement
  const engagementData = {
    labels,
    datasets: [
      {
        label: "Views",
        data: analytics.viewsPerMonth?.map((item) => item.count) || [],
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.5)",
        tension: 0.3,
      },
      {
        label: "Likes",
        data: analytics.likesPerMonth?.map((item) => item.count) || [],
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.5)",
        tension: 0.3,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 mt-10">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaChartBar className="mr-2 h-6 w-6 text-blue-600" />
            Analytics Dashboard
          </h1>
          <div className="flex items-center">
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Time Range Filter */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Time Range</h2>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  timeRange === "month"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setTimeRange("month")}
              >
                Last Month
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  timeRange === "quarter"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setTimeRange("quarter")}
              >
                Last Quarter
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  timeRange === "year"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setTimeRange("year")}
              >
                Last Year
              </button>
            </div>
          </div>
        </div>

        {/* Engagement Summary */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4"
        >
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-4">
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
                        {analytics.totalUsers || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-4">
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
                        {analytics.totalPosts || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <FaEye className="h-8 w-8" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Views
                    </dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">
                        {analytics.totalViews || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <FaThumbsUp className="h-8 w-8" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Likes
                    </dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">
                        {analytics.totalLikes || 0}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts */}
        <div className="grid gap-6 mb-8 md:grid-cols-2">
          {/* Content Growth Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Content Growth
            </h2>
            <div className="h-80">
              <Line options={chartOptions} data={contentGrowthData} />
            </div>
          </motion.div>

          {/* Engagement Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              User Engagement
            </h2>
            <div className="h-80">
              <Line options={chartOptions} data={engagementData} />
            </div>
          </motion.div>
        </div>

        {/* Top Posts */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow rounded-lg mb-8"
        >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Top Performing Posts
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {analytics.topPosts && analytics.topPosts.length > 0 ? (
              analytics.topPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  className="px-6 py-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {post.title}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-1 h-3 w-3" />
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <FaEye className="mr-1 h-3 w-3" />
                          <span>{post.views} views</span>
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <FaThumbsUp className="mr-1 h-3 w-3" />
                          <span>{post.likes} likes</span>
                        </div>
                        <span className="mx-2">•</span>
                        <div className="flex items-center">
                          <FaComments className="mr-1 h-3 w-3" />
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/blogs/${post._id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Post
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No posts data available</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Category Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white shadow rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Category Statistics
            </h3>
          </div>
          <div className="p-6">
            {analytics.categoryStats && analytics.categoryStats.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {analytics.categoryStats.map((category) => (
                  <motion.div
                    key={category._id}
                    variants={itemVariants}
                    className="bg-gray-50 rounded-md p-4"
                  >
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {category.name}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>Posts: {category.postCount}</span>
                      <span>Views: {category.viewCount}</span>
                      <span>Likes: {category.likeCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${category.percentage || 0}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      {category.percentage
                        ? category.percentage.toFixed(1)
                        : "0.0"}
                      % of total content
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>No category data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
