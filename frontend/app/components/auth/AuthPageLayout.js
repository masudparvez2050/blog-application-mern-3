"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

/**
 * AuthPageLayout Component - A layout wrapper for authentication pages
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to render in the layout
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle/description
 * @param {Object} props.backLink - Configuration for back button (href, text)
 */
const AuthPageLayout = ({
  children,
  title,
  subtitle,
  backLink = { href: "/login", text: "Back to login" },
}) => {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        {backLink && (
          <Link
            href={backLink.href}
            className="flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6 transition-colors duration-200"
          >
            <FaArrowLeft className="mr-2" />
            {backLink.text}
          </Link>
        )}
        <h2 className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
        )}
      </motion.div> */}

      {/* Content Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="">{children}</div>
      </motion.div>
    </div>
  );
};

export default AuthPageLayout;
