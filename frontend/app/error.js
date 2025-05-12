"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaBug,
  FaArrowLeft,
  FaHome,
  FaExclamationCircle,
} from "react-icons/fa";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white py-16 px-4">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-red-100 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-orange-100 rounded-full filter blur-3xl opacity-30 animate-float animation-delay-3000"></div>
      </div>

      <motion.div
        className="text-center max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              className="bg-red-100 text-red-600 rounded-full p-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <FaBug size={50} />
            </motion.div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Something Went Wrong
        </h1>
        <p className="text-lg text-gray-600 mb-4">
          We&apos;re sorry, but we encountered an unexpected error while
          processing your request. Our team has been notified and is working on
          a fix.
        </p>
        <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-lg text-left">
          <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
            <FaExclamationCircle />
            <span>Error details:</span>
          </div>
          <p className="text-red-700 text-sm overflow-auto">
            {error?.message || "Unknown error occurred"}
          </p>
        </div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaArrowLeft className="text-white" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 px-6 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaHome className="text-gray-500" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-16 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>
          If this problem persists, please{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            contact our support team
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}
