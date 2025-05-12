"use client";

import { memo } from "react";
import { motion } from "framer-motion";

// Memoized to prevent unnecessary re-renders
const SectionTitle = memo(function SectionTitle({
  title,
  subtitle,
  containerVariants,
  itemVariants,
}) {
  return (
    <motion.div
      className="text-center max-w-3xl mx-auto mb-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
        variants={itemVariants}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p className="text-lg text-gray-600" variants={itemVariants}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
});

export default SectionTitle;
