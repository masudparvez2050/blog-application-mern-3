"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Import components
import DashboardHeader from "@/app/components/dashboard/DashboardHeader";
import StatsOverview from "@/app/components/dashboard/StatsOverview";
import PostFilterControls from "@/app/components/dashboard/PostFilterControls";
import PostsList from "@/app/components/dashboard/PostsList";
import Loading from "../components/shared/Loading";
import AuthLoadingState from "@/app/components/dashboard/AuthLoadingState";

// Import services and utilities
import { getUserPosts, deletePost } from "@/app/services/postService";
import { filterPosts, sortPosts } from "@/app/utils/dashboardUtils";

/**
 * Dashboard page component - Main dashboard for user's blog posts
 */
export default function Dashboard() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // State management
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch user posts when authenticated
  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        // Use the postService to fetch user posts
        const token = localStorage.getItem("token");
        const posts = await getUserPosts(user._id, token);
        setUserPosts(posts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        toast.error("Failed to load your posts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?._id) {
      fetchPosts();
    }
  }, [isAuthenticated, authLoading, router, user]);

  // Calculate post statistics
  const postsStats = {
    totalPosts: userPosts.length,
    publishedPosts: userPosts.filter((post) => post.status === "published")
      .length,
    pendingPosts: userPosts.filter((post) => post.status === "pending").length,
    draftPosts: userPosts.filter((post) => post.status === "draft").length,
  };

  // Apply filters and sorting
  const filteredPosts = sortPosts(
    filterPosts(userPosts, activeTab, searchTerm),
    sortBy
  );

  // Handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      await deletePost(postId, token);

      // Update state after successful deletion
      setUserPosts(userPosts.filter((post) => post._id !== postId));
      toast.success("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  // Clear filters handler
  const handleClearFilters = () => {
    setActiveTab("all");
    setSearchTerm("");
  };

  // Show loading state during authentication
  if (authLoading) {
    return <AuthLoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <DashboardHeader userName={user?.name} />

        {/* Dashboard Overview */}
        <StatsOverview postsStats={postsStats} />

        {/* Posts Filtering and Actions */}
        <PostFilterControls
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
        />

        {/* Posts List with Loading State */}
        {loading ? (
          <Loading />
        ) : (
          <PostsList
            posts={filteredPosts}
            onDeletePost={handleDeletePost}
            activeTab={activeTab}
            searchTerm={searchTerm}
            onClearFilters={handleClearFilters}
          />
        )}
      </div>
    </div>
  );
}
