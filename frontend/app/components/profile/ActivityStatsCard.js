"use client";

import { motion } from "framer-motion";
import { FaPen, FaCheck, FaClock, FaComment } from "react-icons/fa";

const ActivityStatsCard = ({ stats }) => {
  const statItems = [
    {
      icon: <FaPen className="h-4 w-4 text-purple-500" />,
      label: "Total Posts",
      value: stats.posts,
      color: "purple",
    },
    {
      icon: <FaCheck className="h-4 w-4 text-green-500" />,
      label: "Published",
      value: stats.published,
      color: "green",
    },
    {
      icon: <FaClock className="h-4 w-4 text-yellow-500" />,
      label: "Drafts",
      value: stats.drafts,
      color: "yellow",
    },
    {
      icon: <FaComment className="h-4 w-4 text-blue-500" />,
      label: "Comments",
      value: stats.comments,
      color: "blue",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
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
      className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-indigo-100/50 p-6 transition-all hover:shadow-xl"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>

      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            variants={itemVariants}
            className={`bg-${item.color}-50 rounded-lg p-4 transition-transform hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 bg-${item.color}-100 rounded-lg`}>
                {item.icon}
              </div>
              <span className={`text-xl font-bold text-${item.color}-600`}>
                {item.value}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {stats.posts > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Publication Rate</span>
            <span className="font-medium text-indigo-600">
              {Math.round((stats.published / stats.posts) * 100)}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.published / stats.posts) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-indigo-600 rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityStatsCard;
