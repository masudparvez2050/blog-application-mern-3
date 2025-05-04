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
  FaChartPie,
  FaChartLine,
  FaFilter,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className=" flex flex-col items-center">
          <div className="h-14 w-14 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
          <div className="absolute top-0 left-0 h-14 w-14 rounded-full border-r-4 border-l-4 border-blue-300 animate-pulse"></div>
          <p className="mt-4 text-center text-blue-600 font-medium">
            Loading analytics...
          </p>
        </div>
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
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
        },
      },
      x: {
        grid: {
          color: "rgba(107, 114, 128, 0.05)",
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-white mt-10">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-2">
              <FaChartLine className="h-6 w-6" />
            </div>
            Analytics Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600 transition-all duration-200"
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Time Range Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-medium text-gray-900 flex items-center mb-4 md:mb-0">
              <FaFilter className="mr-2 h-4 w-4 text-blue-500" />
              Time Range
            </h2>
            <div className="inline-flex p-1 bg-gray-100 rounded-lg">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  timeRange === "month"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setTimeRange("month")}
              >
                Last Month
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  timeRange === "quarter"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setTimeRange("quarter")}
              >
                Last Quarter
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  timeRange === "year"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-gray-700 hover:text-blue-600"
                }`}
                onClick={() => setTimeRange("year")}
              >
                Last Year
              </button>
            </div>
          </div>
        </motion.div>

        {/* Engagement Summary */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {/* Users Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                  <FaUsers className="h-7 w-7" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Users
                    </dt>
                    <dd>
                      <div className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">
                          {analytics.totalUsers || 0}
                        </div>
                        <span className="ml-2 text-xs font-medium text-green-600">
                          +12%
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: "45%" }}
                        ></div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Posts Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors">
                  <FaNewspaper className="h-7 w-7" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Posts
                    </dt>
                    <dd>
                      <div className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">
                          {analytics.totalPosts || 0}
                        </div>
                        <span className="ml-2 text-xs font-medium text-green-600">
                          +8%
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-green-500 h-1 rounded-full"
                          style={{ width: "60%" }}
                        ></div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Views Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-200 transition-colors">
                  <FaEye className="h-7 w-7" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Views
                    </dt>
                    <dd>
                      <div className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">
                          {analytics.totalViews || 0}
                        </div>
                        <span className="ml-2 text-xs font-medium text-green-600">
                          +22%
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-amber-500 h-1 rounded-full"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Likes Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 opacity-0 group-hover:opacity-5 transition-opacity"></div>
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-200 transition-colors">
                  <FaThumbsUp className="h-7 w-7" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Likes
                    </dt>
                    <dd>
                      <div className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900">
                          {analytics.totalLikes || 0}
                        </div>
                        <span className="ml-2 text-xs font-medium text-green-600">
                          +15%
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-purple-500 h-1 rounded-full"
                          style={{ width: "52%" }}
                        ></div>
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
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaChartLine className="mr-2 h-5 w-5 text-blue-500" />
              Content Growth
            </h2>
            <div className="h-80">
              <Line options={chartOptions} data={contentGrowthData} />
            </div>
          </motion.div>

          {/* Engagement Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
          >
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <FaChartBar className="mr-2 h-5 w-5 text-amber-500" />
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
          className="bg-white shadow-sm border border-gray-100 rounded-xl mb-8 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <FaNewspaper className="mr-2 h-5 w-5 text-green-500" />
              Top Performing Posts
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {analytics.topPosts && analytics.topPosts.length > 0 ? (
              analytics.topPosts.map((post, index) => (
                <motion.div
                  key={post._id}
                  variants={itemVariants}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {post.title}
                      </div>
                      <div className="flex flex-wrap gap-y-2 items-center text-xs text-gray-500">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1 h-3 w-3" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <div className="flex items-center">
                          <FaEye className="mr-1 h-3 w-3 text-blue-500" />
                          <span>{post.views} views</span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <div className="flex items-center">
                          <FaThumbsUp className="mr-1 h-3 w-3 text-red-500" />
                          <span>{post.likes} likes</span>
                        </div>
                        <span className="mx-2 text-gray-300">•</span>
                        <div className="flex items-center">
                          <FaComments className="mr-1 h-3 w-3 text-green-500" />
                          <span>{post.comments} comments</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/blogs/${post._id}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
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
          className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <FaChartPie className="mr-2 h-5 w-5 text-purple-500" />
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
                    className="bg-gray-50 rounded-lg p-5 hover:shadow-sm transition-all duration-200 border border-gray-100"
                  >
                    <div className="text-base font-medium text-gray-900 mb-3">
                      {category.name}
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div className="bg-white rounded-md p-2 text-center border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Posts</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {category.postCount}
                        </div>
                      </div>
                      <div className="bg-white rounded-md p-2 text-center border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Views</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {category.viewCount}
                        </div>
                      </div>
                      <div className="bg-white rounded-md p-2 text-center border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Likes</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {category.likeCount}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
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
              <div className="text-center text-gray-500 py-8">
                <p>No category data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
