"use client";

import { motion } from "framer-motion";
import { FaChartPie } from "react-icons/fa";

const CategoryStats = ({ categories = [] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          <FaChartPie className="mr-2 h-5 w-5 text-purple-500" />
          Category Statistics
        </h3>
      </div>
      <div className="p-6">
        {categories && categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <motion.div
                key={category._id}
                variants={itemVariants}
                className="bg-gray-50 rounded-lg p-5 hover:shadow-sm transition-all duration-200 border border-gray-100"
              >
                <div className="text-base font-medium text-gray-900 mb-3">
                  {category.name}
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-white rounded-md p-2 text-center border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Posts</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {category.postCount}
                    </div>
                  </div>
                  <div className="bg-white rounded-md p-2 text-center border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Views</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {category.viewCount}
                    </div>
                  </div>
                  <div className="bg-white rounded-md p-2 text-center border border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Likes</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {category.likeCount}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                    style={{ width: `${category.percentage || 0}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {category.percentage
                    ? category.percentage.toFixed(1)
                    : "0.0"}
                  % of total content
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No category data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryStats;
