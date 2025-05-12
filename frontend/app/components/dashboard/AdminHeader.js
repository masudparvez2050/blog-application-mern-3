"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaTachometerAlt,
  FaChartBar,
  FaNewspaper,
  FaComments,
  FaUsers,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

/**
 * AdminHeader component - Displays the header for admin dashboard
 */
const AdminHeader = ({ user, handleLogout }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-2">
                  <FaTachometerAlt className="h-6 w-6" />
                </div>
                Admin Dashboard
              </div>
            </h1>

            {/* Navigation tabs for desktop */}
            <nav className="hidden md:flex space-x-4">
              <Link
                href="/admin/analytics"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors flex items-center"
              >
                <FaChartBar className="mr-1.5 h-4 w-4" /> Analytics
              </Link>
              <Link
                href="/admin/posts"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors flex items-center"
              >
                <FaNewspaper className="mr-1.5 h-4 w-4" /> Posts
              </Link>
              <Link
                href="/admin/comments"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors flex items-center"
              >
                <FaComments className="mr-1.5 h-4 w-4" /> Comments
              </Link>
              <Link
                href="/admin/users"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 transition-colors flex items-center"
              >
                <FaUsers className="mr-1.5 h-4 w-4" /> Users
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search - can be expanded later */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-8 pr-4 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
              <FaSearch className="absolute left-2.5 top-2.5 text-gray-400 h-3.5 w-3.5" />
            </div>

            {/* Admin Avatar */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  {user?.name || "Admin"}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all"
            >
              <FaSignOutAlt className="mr-1.5 h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
