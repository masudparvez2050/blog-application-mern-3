"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaChartBar,
  FaNewspaper,
  FaComments,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
} from "react-icons/fa";

export default function AdminLayout({ children }) {
  const { isAuthenticated, loading, isAdmin, logout, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      router.push("/login?redirect=/admin");
      return;
    }

    // Handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAuthenticated, isAdmin, loading, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Sidebar navigation items with active state based on current path
  const navigationItems = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      href: "/admin",
      current: pathname === "/admin",
    },
    {
      name: "Analytics",
      icon: <FaChartBar />,
      href: "/admin/analytics",
      current: pathname === "/admin/analytics",
    },
    {
      name: "Posts",
      icon: <FaNewspaper />,
      href: "/admin/posts",
      current: pathname.startsWith("/admin/posts"),
    },
    {
      name: "Comments",
      icon: <FaComments />,
      href: "/admin/comments",
      current: pathname === "/admin/comments",
    },
    {
      name: "Users",
      icon: <FaUsers />,
      href: "/admin/users",
      current: pathname.startsWith("/admin/users"),
    },
    {
      name: "Categories",
      icon: <FaNewspaper />,
      href: "/admin/category",
      current: pathname === "/admin/category",
    },
    {
      name: "Settings",
      icon: <FaCog />,
      href: "/admin/settings",
      current: pathname === "/admin/settings",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transform fixed lg:relative inset-y-0 left-0 w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white transition duration-300 ease-in-out z-30 lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-700">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-indigo-700 text-white mr-2">
              <FaTachometerAlt className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-indigo-200"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="flex flex-col items-center py-5 border-b border-indigo-700">
          <div className="relative h-16 w-16 rounded-full overflow-hidden mb-2 bg-indigo-600 flex items-center justify-center text-2xl font-bold">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user?.name || "Admin"}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              user?.name?.charAt(0).toUpperCase() || "A"
            )}
          </div>
          <h3 className="text-sm font-medium">{user?.name || "Admin User"}</h3>
          <p className="text-xs text-indigo-300">
            {user?.email || "admin@example.com"}
          </p>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                item.current
                  ? "bg-indigo-700 text-white"
                  : "text-indigo-100 hover:bg-indigo-700 hover:text-white"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-4 mt-auto border-t border-indigo-700">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-indigo-100 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm z-20">
          <div className="flex justify-between items-center px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaBars className="h-6 w-6" />
            </button>

            <div className="flex-1 ml-4 lg:ml-0">
              <h2 className="text-xl font-semibold text-gray-800">
                {navigationItems.find((item) => item.current)?.name ||
                  "Admin Dashboard"}
              </h2>
            </div>

            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative mr-4">
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <FaBell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
              </div>

              {/* User menu - can be expanded */}
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
              </div>
              {/* Go to Site */}
              <Link
                href="/"
                className="flex items-center mr-5 px-3 py-1 ml-2 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors"
              >
                <span className="mr-1">View Site</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
