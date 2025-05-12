"use client";

import { memo } from "react";
import { motion } from "framer-motion";

// Memoized header component to prevent unnecessary re-renders
const BlogsHeader = memo(function BlogsHeader() {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Explore Our Blog
          </motion.h1>

          <motion.p
            className="text-xl text-gray-700 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover articles, stories, and insights from our community of
            writers. Stay informed with the latest trends and thoughtful
            perspectives.
          </motion.p>

          <motion.div
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-px rounded-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white px-8 py-4 rounded-xl">
              <span className="text-gray-800 font-medium">
                <span className="text-blue-600 font-bold">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                &nbsp;• New articles every week
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default BlogsHeader;
