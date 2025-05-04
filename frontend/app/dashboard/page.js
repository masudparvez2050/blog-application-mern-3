"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaEye,
  FaHeart,
  FaComment,
  FaEdit,
  FaTrash,
  FaExternalLinkAlt,
  FaLayerGroup,
  FaCheckCircle,
  FaHourglassHalf,
  FaPencilAlt,
  FaSearch,
  FaSlidersH,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setUserPosts(data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        toast.error("Failed to load your posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?._id) {
      fetchUserPosts();
    }
  }, [isAuthenticated, authLoading, router, user]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Filter posts by status and search term
  const filteredPosts = userPosts
    .filter((post) => {
      // Filter by status
      if (activeTab !== "all" && post.status !== activeTab) {
        return false;
      }

      // Filter by search term
      if (searchTerm.trim() !== "") {
        return (
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      return true;
    })
    .sort((a, b) => {
      // Sort posts
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "most-viewed") {
        return b.views - a.views;
      } else if (sortBy === "most-liked") {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "from-green-500 to-emerald-600";
      case "pending":
        return "from-blue-500 to-indigo-500";
      case "draft":
        return "from-amber-400 to-yellow-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "published":
        return <FaCheckCircle className="mr-1.5" />;
      case "pending":
        return <FaHourglassHalf className="mr-1.5" />;
      case "draft":
        return <FaPencilAlt className="mr-1.5" />;
      default:
        return null;
    }
  };

  const handleDeletePost = async (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        // Update state after successful deletion
        setUserPosts(userPosts.filter((post) => post._id !== postId));
        toast.success("Post deleted successfully!");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Failed to delete post. Please try again.");
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
      },
    },
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-3">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Welcome back,{" "}
            <span className="font-medium text-gray-900">{user?.name}</span>.
            Manage your blog posts and track your content performance.
          </p>
        </motion.div>

        {/* Dashboard Overview */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Total Posts */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium mb-1">
                  Total Posts
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                  {userPosts.length}
                </h2>
              </div>
              <div className="p-4 rounded-xl bg-blue-100/50 text-blue-600">
                <FaLayerGroup className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          {/* Published */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium mb-1">
                  Published
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                  {
                    userPosts.filter((post) => post.status === "published")
                      .length
                  }
                </h2>
              </div>
              <div className="p-4 rounded-xl bg-green-100/50 text-green-600">
                <FaCheckCircle className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          {/* Pending */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium mb-1">
                  Pending
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                  {userPosts.filter((post) => post.status === "pending").length}
                </h2>
              </div>
              <div className="p-4 rounded-xl bg-indigo-100/50 text-indigo-600">
                <FaHourglassHalf className="h-6 w-6" />
              </div>
            </div>
          </motion.div>

          {/* Drafts */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 uppercase font-medium mb-1">
                  Drafts
                </p>
                <h2 className="text-3xl font-bold text-gray-900">
                  {userPosts.filter((post) => post.status === "draft").length}
                </h2>
              </div>
              <div className="p-4 rounded-xl bg-amber-100/50 text-amber-600">
                <FaPencilAlt className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Actions and Filtering */}
        <motion.div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              />
              <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>

            {/* Mobile filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700"
            >
              <FaSlidersH /> {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            <div
              className={`flex flex-wrap gap-2 ${
                showFilters ? "flex" : "hidden md:flex"
              }`}
            >
              {/* Status Filters */}
              <button
                className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activeTab === "all"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("all")}
              >
                <FaLayerGroup
                  className={`${
                    activeTab === "all" ? "text-white" : "text-gray-500"
                  }`}
                />{" "}
                All
              </button>
              <button
                className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activeTab === "published"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("published")}
              >
                <FaCheckCircle
                  className={`${
                    activeTab === "published" ? "text-white" : "text-green-500"
                  }`}
                />{" "}
                Published
              </button>
              <button
                className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activeTab === "pending"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("pending")}
              >
                <FaHourglassHalf
                  className={`${
                    activeTab === "pending" ? "text-white" : "text-blue-500"
                  }`}
                />{" "}
                Pending
              </button>
              <button
                className={`px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                  activeTab === "draft"
                    ? "bg-amber-500 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("draft")}
              >
                <FaPencilAlt
                  className={`${
                    activeTab === "draft" ? "text-white" : "text-amber-500"
                  }`}
                />{" "}
                Drafts
              </button>
            </div>
          </div>

          {/* Sort & Create Post */}
          <div className="flex gap-3 w-full lg:w-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2.5 px-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-viewed">Most Viewed</option>
              <option value="most-liked">Most Liked</option>
            </select>

            <Link
              href="/dashboard/create-post"
              className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-md whitespace-nowrap ml-auto"
            >
              <FaPlus className="h-4 w-4" />
              <span>Create Post</span>
            </Link>
          </div>
        </motion.div>

        {/* Posts List */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse flex flex-col md:flex-row gap-4"
                >
                  <div className="w-full md:w-24 h-24 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredPosts.map((post) => (
              <motion.div
                key={post._id}
                variants={itemVariants}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-100 overflow-hidden transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Post Thumbnail */}
                  <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div
                      className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getStatusColor(
                        post.status
                      )}`}
                    >
                      <div className="flex items-center">
                        {getStatusIcon(post.status)}
                        <span>
                          {post.status === "published"
                            ? "Published"
                            : post.status === "pending"
                            ? "Pending"
                            : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Post Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="mr-4">
                          {formatDate(post.createdAt)}
                        </span>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <FaEye className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{post.views || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <FaHeart className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{post.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center">
                            <FaComment className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{post.comments?.length || 0}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/blogs/${post._id}`}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="View post"
                        >
                          <FaExternalLinkAlt />
                        </Link>
                        <Link
                          href={`/dashboard/edit-post/${post._id}`}
                          className="text-indigo-600 hover:text-indigo-800 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                          title="Edit post"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete post"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="bg-white rounded-2xl shadow-md p-12 text-center border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <svg
              className="h-20 w-20 text-gray-300 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              No posts found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {activeTab === "all" && !searchTerm
                ? "You haven't created any posts yet. Start writing your first post!"
                : `No posts found matching your ${
                    searchTerm ? "search" : "filters"
                  }. Try adjusting your criteria.`}
            </p>
            {activeTab === "all" && !searchTerm ? (
              <Link
                href="/dashboard/create-post"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-blue-700 shadow-md transition-all"
              >
                <FaPlus className="mr-2" />
                Create your first post
              </Link>
            ) : (
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchTerm("");
                }}
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 shadow-sm transition-all"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
