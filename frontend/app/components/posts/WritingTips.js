"use client";

import { motion } from "framer-motion";
import { FaInfoCircle } from "react-icons/fa";
import { formAnimationVariants } from "@/app/utils/postFormUtils";

/**
 * Writing Tips component to provide guidance to authors
 */
const WritingTips = () => {
  return (
    <motion.div
      variants={formAnimationVariants.containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-blue-50 rounded-lg overflow-hidden border border-blue-100"
    >
      <div className="p-6">
        <div className="flex items-center mb-3">
          <FaInfoCircle className="h-5 w-5 text-blue-500" />
          <h2 className="ml-2 text-lg font-medium text-blue-800">
            Writing Tips
          </h2>
        </div>
        <motion.ul
          variants={formAnimationVariants.itemVariants}
          className="text-sm text-blue-700 space-y-2 pl-5 list-disc"
        >
          <li>Use a clear, attention-grabbing title</li>
          <li>Break up content with subheadings</li>
          <li>Include relevant images to enhance your content</li>
          <li>Use categories and tags to help readers find your post</li>
          <li>Preview your post before submitting for review</li>
        </motion.ul>
      </div>
    </motion.div>
  );
};

export default WritingTips;
