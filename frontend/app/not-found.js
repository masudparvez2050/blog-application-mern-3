"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaArrowLeft,
  FaHome,
  FaSearch,
} from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-white py-16 px-4">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-30 animate-float animation-delay-3000"></div>
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
              className="text-9xl font-bold text-blue-600"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              404
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-4 bg-red-500 rounded-full p-3 text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                delay: 0.4,
              }}
            >
              <FaExclamationTriangle size={24} />
            </motion.div>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t seem to exist. It
          might have been moved, deleted, or never existed in the first place.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/"
            className="flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaHome className="text-white" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/blogs"
            className="flex items-center justify-center gap-2 py-3 px-6 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaSearch className="text-gray-500" />
            <span>Browse Content</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FaArrowLeft className="text-gray-500" />
            <span>Go Back</span>
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-16 text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>
          If you believe this is a mistake, please{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            contact our support team
          </Link>
          .
        </p>
      </motion.div>
    </div>
  );
}
