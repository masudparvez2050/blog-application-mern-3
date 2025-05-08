"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
<<<<<<< HEAD
=======
import "@/app/globals.css";
>>>>>>> 315e87c (:message)

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-20 md:py-32 lg:px-32 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 rounded-3xl">
      {/* Background Elements - Animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-blob"></div>
        <div className="absolute top-0 -left-16 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"
        style={{ backgroundSize: "30px 30px" }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div
            className={`w-full md:w-1/2 mb-16 md:mb-0 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <div className="space-y-6">
              <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium tracking-wide mb-2">
                Welcome to BlogApp 2025
              </span>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
                Discover, Create, and Share{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-shimmer">
                  Amazing Blogs
                </span>
              </h1>

              <p className="text-xl text-gray-700 mb-8 max-w-lg leading-relaxed">
                Join our community of writers and readers. Find inspiration,
                knowledge, and entertainment through thoughtful articles in our
                fully interactive platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/blogs"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-center"
                >
                  Explore Blogs
                </Link>
                <Link
                  href="/register"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl font-medium shadow-lg hover:shadow-xl border border-gray-100 transform hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-center"
                >
                  Join Now
                </Link>
              </div>

              {/* Stats counter */}
              <div className="flex flex-wrap gap-8 mt-8 pt-8 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-gray-900">10K+</span>
                  <span className="text-gray-600">Articles</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-gray-900">
                    2.5M+
                  </span>
                  <span className="text-gray-600">Readers</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-gray-900">15K+</span>
                  <span className="text-gray-600">Writers</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`w-full md:w-1/2 relative transition-all duration-1000 ease-out delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
            style={{
              transform: `translateY(${scrollY * 0.05}px)`,
            }}
          >
            <div className="relative z-10 mx-auto md:mr-0 max-w-lg">
              {/* Main image with animation */}
              <div className="w-full h-80 md:h-[500px] relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                  alt="Blog Hero"
                  fill
                  style={{ objectFit: "cover" }}
                  className="transition-transform duration-700 hover:scale-105"
                  priority
                />

                {/* Glowing effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Floating elements */}
                <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Daily Read</p>
                      <p className="text-xs text-gray-500">5 mins</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 -left-6 bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 rounded-lg shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                  <p className="text-white font-medium text-sm">Trending Now</p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-yellow-400 rounded-full opacity-80 blur-sm animate-pulse"></div>
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-purple-400 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Additional animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 15s infinite alternate;
        }

        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              #e5e7eb 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
        }
      `}</style>
=======
    
>>>>>>> 315e87c (:message)
    </section>
  );
}
