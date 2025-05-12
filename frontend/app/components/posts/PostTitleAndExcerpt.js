"use client";

import { motion } from "framer-motion";
import { formAnimationVariants } from "@/app/utils/postFormUtils";

/**
 * Component for post title and excerpt inputs
 */
const PostTitleAndExcerpt = ({ title, excerpt, onChange }) => {
  return (
    <motion.div
      variants={formAnimationVariants.containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow rounded-lg overflow-hidden"
    >
      <div className="p-6">
        {/* Post Title */}
        <motion.div
          variants={formAnimationVariants.itemVariants}
          className="mb-4"
        >
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={onChange}
            className="block w-full border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-blue-600 text-2xl font-bold placeholder-gray-400"
            placeholder="Enter your post title"
            autoComplete="off"
          />
        </motion.div>

        {/* Post Excerpt */}
        <motion.div variants={formAnimationVariants.itemVariants}>
          <textarea
            name="excerpt"
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={onChange}
            className="block w-full border-0 focus:ring-0 text-gray-500 resize-none placeholder-gray-400"
            placeholder="Write a brief excerpt for your post..."
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PostTitleAndExcerpt;
