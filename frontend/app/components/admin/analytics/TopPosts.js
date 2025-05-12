"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaNewspaper, FaCalendarAlt, FaEye, FaThumbsUp, FaComments } from "react-icons/fa";

const TopPosts = ({ posts = [] }) => {
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
          <FaNewspaper className="mr-2 h-5 w-5 text-green-500" />
          Top Performing Posts
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <motion.div
              key={post._id}
              variants={itemVariants}
              className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 mb-1">
                    {post.title}
                  </div>
                  <div className="flex flex-wrap gap-y-2 items-center text-xs text-gray-500">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 h-3 w-3" />
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <div className="flex items-center">
                      <FaEye className="mr-1 h-3 w-3 text-indigo-500" />
                      <span>{post.views} views</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <div className="flex items-center">
                      <FaThumbsUp className="mr-1 h-3 w-3 text-red-500" />
                      <span>{post.likes} likes</span>
                    </div>
                    <span className="mx-2 text-gray-300">•</span>
                    <div className="flex items-center">
                      <FaComments className="mr-1 h-3 w-3 text-green-500" />
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/blogs/${post._id}`}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                >
                  View Post
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="px-6 py-8 text-center text-gray-500">
            <p>No posts data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopPosts;
