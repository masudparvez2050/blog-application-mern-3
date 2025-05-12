"use client";

import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-96">
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </motion.div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="ml-4 text-gray-600 font-medium"
      >
        Loading...
      </motion.span>
    </div>
  );
};

export default Loading;
