"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function CallToActionSection() {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.2,
      },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  const glowVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.3 },
    hover: {
      opacity: 0.6,
      scale: 1.05,
      filter: "blur(20px)",
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl py-16 px-8 md:px-16 text-center overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          whileHover="hover"
          viewport={{ once: true, amount: 0.3 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Background glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl"
            variants={glowVariants}
            animate={isHovered ? "hover" : "visible"}
            style={{
              filter: "blur(50px)",
              opacity: 0.35,
              transform: "scale(0.95) translateY(5px)",
            }}
          />

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full border border-white/20 transform -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full border border-white/20 transform translate-y-1/2"></div>
            <motion.div
              className="absolute top-1/2 left-0 w-20 h-20 bg-white/10 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 15,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-16 h-16 bg-white/10 rounded-full"
              animate={{
                x: [0, -80, 0],
                y: [0, 40, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 20,
                ease: "easeInOut",
              }}
            />
          </div>

          <div className="relative z-10">
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight"
              variants={itemVariants}
            >
              Ready to share your{" "}
              <span className="relative">
                <span className="relative z-10">story</span>
                <span className="absolute -bottom-1 left-0 w-full h-3 bg-blue-300/30 rounded-lg -z-0"></span>
              </span>{" "}
              with the world?
            </motion.h2>

            <motion.p
              className="text-blue-100 mb-10 max-w-2xl mx-auto text-lg"
              variants={itemVariants}
            >
              Join our thriving community of writers and readers. Create an
              account today to start sharing your knowledge and connect with
              like-minded individuals.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-6"
              variants={itemVariants}
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/register"
                  className="block w-full sm:w-auto px-10 py-4 bg-white text-blue-600 rounded-xl font-medium shadow-xl shadow-blue-700/20 hover:bg-blue-50 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>Sign Up Now</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  href="/blogs"
                  className="block w-full sm:w-auto px-10 py-4 bg-transparent text-white border-2 border-white/60 backdrop-blur-sm rounded-xl font-medium hover:bg-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                >
                  Explore Blogs
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-10 flex items-center justify-center gap-6 text-white/80"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
                <span>10k+ Members</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                  />
                </svg>
                <span>50k+ Articles</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                  />
                </svg>
                <span>1M+ Monthly Reads</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
