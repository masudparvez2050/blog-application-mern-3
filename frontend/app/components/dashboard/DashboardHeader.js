"use client";

import { motion } from "framer-motion";

/**
 * Dashboard Header component with welcome message and user info
 */
const DashboardHeader = ({ userName }) => {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-3">
        Dashboard
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl">
        Welcome back,{" "}
        <span className="font-medium text-gray-900">{userName}</span>. Manage
        your blog posts and track your content performance.
      </p>
    </motion.div>
  );
};

export default DashboardHeader;
