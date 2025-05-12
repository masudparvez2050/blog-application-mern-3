"use client";

import { motion } from "framer-motion";
import {
  FaLayerGroup,
  FaCheckCircle,
  FaHourglassHalf,
  FaPencilAlt,
} from "react-icons/fa";
import { animationVariants } from "@/app/utils/dashboardUtils";

/**
 * Stats Overview component for displaying post statistics
 */
const StatsOverview = ({ postsStats }) => {
  const { totalPosts, publishedPosts, pendingPosts, draftPosts } = postsStats;

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      variants={animationVariants.containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Total Posts */}
      <motion.div
        variants={animationVariants.itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 uppercase font-medium mb-1">
              Total Posts
            </p>
            <h2 className="text-3xl font-bold text-gray-900">{totalPosts}</h2>
          </div>
          <div className="p-4 rounded-xl bg-blue-100/50 text-blue-600">
            <FaLayerGroup className="h-6 w-6" />
          </div>
        </div>
      </motion.div>

      {/* Published */}
      <motion.div
        variants={animationVariants.itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 uppercase font-medium mb-1">
              Published
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              {publishedPosts}
            </h2>
          </div>
          <div className="p-4 rounded-xl bg-green-100/50 text-green-600">
            <FaCheckCircle className="h-6 w-6" />
          </div>
        </div>
      </motion.div>

      {/* Pending */}
      <motion.div
        variants={animationVariants.itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 uppercase font-medium mb-1">
              Pending
            </p>
            <h2 className="text-3xl font-bold text-gray-900">{pendingPosts}</h2>
          </div>
          <div className="p-4 rounded-xl bg-indigo-100/50 text-indigo-600">
            <FaHourglassHalf className="h-6 w-6" />
          </div>
        </div>
      </motion.div>

      {/* Drafts */}
      <motion.div
        variants={animationVariants.itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 uppercase font-medium mb-1">
              Drafts
            </p>
            <h2 className="text-3xl font-bold text-gray-900">{draftPosts}</h2>
          </div>
          <div className="p-4 rounded-xl bg-amber-100/50 text-amber-600">
            <FaPencilAlt className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatsOverview;
