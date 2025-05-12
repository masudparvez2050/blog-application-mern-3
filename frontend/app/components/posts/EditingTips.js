"use client";

import { motion } from "framer-motion";
import { FaInfoCircle, FaHistory } from "react-icons/fa";
import { formAnimationVariants } from "@/app/utils/postFormUtils";

/**
 * EditingTips component - Provides tips for editing posts
 */
const EditingTips = () => {
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
            Editing Tips
          </h2>
        </div>
        <motion.ul
          variants={formAnimationVariants.itemVariants}
          className="text-sm text-blue-700 space-y-2 pl-5 list-disc"
        >
          <li>Update any outdated information</li>
          <li>Check for typos and grammatical errors</li>
          <li>Make sure your title is still relevant and engaging</li>
          <li>Consider adding new images to enhance your content</li>
          <li>Review and update categories and tags if needed</li>
          <li>Preview your changes before saving</li>
        </motion.ul>
        <motion.div
          variants={formAnimationVariants.itemVariants}
          className="mt-4 text-xs text-blue-600 flex items-center"
        >
          <FaHistory className="h-3 w-3 mr-2" />
          <p>Edited posts will be reviewed before being republished</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditingTips;
