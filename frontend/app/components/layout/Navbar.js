"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  console.log(user);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-2"
          : "bg-white/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            Bloggenix
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`nav-link ${
                pathname === "/"
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Home
            </Link>
            <Link
              href="/blogs"
              className={`nav-link ${
                pathname.startsWith("/blogs")
                  ? "text-blue-600 font-medium"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              Blogs
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href={
                    isAdmin ? "/admin/posts/create" : "/dashboard/create-post"
                  }
                  className={`nav-link ${
                    pathname === "/create-post"
                      ? "text-blue-600 font-medium"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Write Post
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 focus:outline-none">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover mr-2"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
                        <span className="text-xs text-gray-600">
                          {user?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                    )}
                    <span>Account</span>
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
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    )}

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4">
            <Link
              href="/"
              className="block py-2 text-gray-600 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/blogs"
              className="block py-2 text-gray-600 hover:text-blue-600"
            >
              Blogs
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  href="/create-post"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                >
                  Write
                </Link>
                <Link
                  href="/dashboard"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block py-2 text-gray-600 hover:text-blue-600"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left block py-2 text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-2 text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block py-2 text-blue-600 font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
