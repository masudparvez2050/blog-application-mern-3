"use client";

import { motion } from "framer-motion";
import { FaUsers, FaNewspaper, FaComments, FaEye } from "react-icons/fa";

/**
 * Component for displaying admin dashboard statistics cards
 */
const AdminStatCards = ({ stats }) => {
  const { totalUsers, totalPosts, totalComments, totalViews } = stats;

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

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Total Users */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 uppercase font-medium mb-1">
              Total Users
            </p>
            <h2 className="text-3xl font-bold text-gray-900">{totalUsers}</h2>
          </div>
          <div className="p-4 rounded-xl bg-purple-100/50 text-purple-600">
            <FaUsers className="h-6 w-6" />
          </div>
        </div>
      </motion.div>

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
            <h2 className="text-3xl font-bold text-gray-900">{totalPosts}</h2>
          </div>
          <div className="p-4 rounded-xl bg-blue-100/50 text-blue-600">
            <FaNewspaper className="h-6 w-6" />
          </div>
        </div>
      </motion.div>

      {/* Total Comments */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 uppercase font-medium mb-1">
              Total Comments
            </p>
            <h2 className="text-3xl font-bold text-gray-900">
              {totalComments}
            </h2>
          </div>
          <div className="p-4 rounded-xl bg-green-100/50 text-green-600">
            <FaComments className="h-6 w-6" />
          </div>
        </div>
      </motion.div>

      {/* Total Views */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 uppercase font-medium mb-1">
              Total Views
            </p>
            <h2 className="text-3xl font-bold text-gray-900">{totalViews}</h2>
          </div>
          <div className="p-4 rounded-xl bg-amber-100/50 text-amber-600">
            <FaEye className="h-6 w-6" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminStatCards;
