"use client";

import { motion } from "framer-motion";
import PostCard from "./PostCard";
import EmptyState from "./EmptyState";
import { animationVariants } from "@/app/utils/dashboardUtils";

/**
 * PostsList component for displaying a list of posts
 */
const PostsList = ({
  posts,
  onDeletePost,
  activeTab,
  searchTerm,
  onClearFilters,
}) => {
  if (posts.length === 0) {
    return (
      <EmptyState
        activeTab={activeTab}
        searchTerm={searchTerm}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <motion.div
      variants={animationVariants.containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDelete={onDeletePost} />
      ))}
    </motion.div>
  );
};

export default PostsList;
