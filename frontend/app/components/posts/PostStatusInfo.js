"use client";

import { motion } from "framer-motion";
import { FaInfoCircle, FaCalendarAlt, FaEye } from "react-icons/fa";
import { formAnimationVariants } from "@/app/utils/postFormUtils";

/**
 * PostStatusInfo component - Displays info about a published post's status
 */
const PostStatusInfo = ({ publishedDate, viewCount }) => {
  // Format the date if provided
  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not yet published";

  return (
    <motion.div
      variants={formAnimationVariants.containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-green-50 rounded-lg overflow-hidden border border-green-100"
    >
      <div className="p-6">
        <div className="flex items-center mb-3">
          <FaInfoCircle className="h-5 w-5 text-green-600" />
          <h2 className="ml-2 text-lg font-medium text-green-800">
            Publication Info
          </h2>
        </div>

        <motion.div
          variants={formAnimationVariants.itemVariants}
          className="space-y-3"
        >
          <div className="flex items-center text-green-700">
            <FaCalendarAlt className="h-4 w-4 mr-2" />
            <div>
              <p className="text-sm font-medium">Published on:</p>
              <p className="text-sm">{formattedDate}</p>
            </div>
          </div>

          {viewCount !== undefined && (
            <div className="flex items-center text-green-700">
              <FaEye className="h-4 w-4 mr-2" />
              <div>
                <p className="text-sm font-medium">Views:</p>
                <p className="text-sm">{viewCount || 0}</p>
              </div>
            </div>
          )}

          <div className="mt-3 text-xs text-green-700">
            <p>
              This post was previously published. Submitting edits will send it
              back for review.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PostStatusInfo;
