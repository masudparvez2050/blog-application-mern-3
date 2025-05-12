"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import PostCard from "../shared/PostCard";
import PostCardSkeleton from "../shared/PostCardSkeleton";
import Pagination from "./Pagination";

/**
 * Container to render either blog posts or loading skeletons in a responsive grid
 */
const BlogGrid = memo(function BlogGrid({
  posts = [],
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  // Define animation for cards appearing
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Loading state - show skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(9)
          .fill()
          .map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {posts.map((post) => (
          <PostCard key={post._id} post={post} animateEntry={true} />
        ))}
      </motion.div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
});

export default BlogGrid;
