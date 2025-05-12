/**
 * Dashboard Utilities - Helper functions for dashboard operations
 */

/**
 * Format a date string in a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

/**
 * Filter posts by search term and status
 * @param {Array} posts - Array of posts to filter
 * @param {string} activeTab - Current active tab/status filter
 * @param {string} searchTerm - Search term to filter by
 * @returns {Array} - Filtered posts
 */
export const filterPosts = (posts, activeTab, searchTerm) => {
  return posts.filter((post) => {
    // Filter by status
    if (activeTab !== "all" && post.status !== activeTab) {
      return false;
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchLower) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });
};

/**
 * Sort posts by different criteria
 * @param {Array} posts - Array of posts to sort
 * @param {string} sortBy - Sort criteria (newest, oldest, most-viewed, most-liked)
 * @returns {Array} - Sorted posts
 */
export const sortPosts = (posts, sortBy) => {
  return [...posts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "most-viewed":
        return (b.views || 0) - (a.views || 0);
      case "most-liked":
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      default:
        return 0;
    }
  });
};

/**
 * Get the appropriate color for a post status
 * @param {string} status - Post status (published, pending, draft)
 * @returns {string} - Tailwind CSS class for gradient color
 */
export const getStatusColor = (status) => {
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

/**
 * Get the appropriate icon for a post status
 * @param {string} status - Post status (published, pending, draft)
 * @returns {JSX.Element} - React icon component
 */
export const getStatusIcon = (status) => {
  // Note: This function returns a string that will be used as a component name
  // in the actual component where it's imported
  switch (status) {
    case "published":
      return "FaCheckCircle";
    case "pending":
      return "FaHourglassHalf";
    case "draft":
      return "FaPencilAlt";
    default:
      return null;
  }
};

/**
 * Animation variants for Framer Motion
 */
export const animationVariants = {
  containerVariants: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },

  itemVariants: {
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
  },
};
