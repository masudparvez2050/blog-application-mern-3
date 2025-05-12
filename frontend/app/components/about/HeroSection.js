"use client";

import { motion } from "framer-motion";

export function HeroSection({ containerVariants, itemVariants }) {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      {/* Background gradient circles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-[15%] w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            variants={itemVariants}
          >
            About Bloggenix
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-700 mb-10 leading-relaxed"
            variants={itemVariants}
          >
            We&apos;re a platform dedicated to empowering writers and connecting
            readers with ideas that matter. Our mission is to create a home for
            quality content from diverse voices across the globe.
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-[1px] rounded-lg">
              <div className="bg-white px-6 py-3 rounded-lg">
                <span className="font-bold">Since</span>
                <span className="ml-2 text-blue-600 font-bold">2022</span>
              </div>
            </div>

            <div className="bg-white px-6 py-3 rounded-lg shadow-md">
              <span className="font-bold">Trusted By</span>
              <span className="ml-2 text-purple-600 font-bold">Millions</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
