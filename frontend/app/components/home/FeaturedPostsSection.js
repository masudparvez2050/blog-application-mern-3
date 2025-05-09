"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import PostCard from "../shared/PostCard";
import PostCardSkeleton from "../shared/PostCardSkeleton";

export default function FeaturedPostsSection({ posts }) {
  const [activeTab, setActiveTab] = useState("all");
  const [visiblePosts, setVisiblePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [inView, setInView] = useState(false);

  // Categories for filter tabs
  const categories = [
    { id: "all", name: "All Posts" },
    { id: "technology", name: "Technology" },
    { id: "lifestyle", name: "Lifestyle" },
    { id: "travel", name: "Travel" },
    { id: "business", name: "Business" },
  ];

  // Simulate loading and set animation trigger
  useEffect(() => {
    // Simulating loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
      setVisiblePosts(posts || []);
    }, 500);

    // Add intersection observer for animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById("featured-posts-section");
    if (section) {
      observer.observe(section);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [posts]);

  // Handle tab change and filter posts
  const handleTabChange = (tabId) => {
    setIsLoading(true);
    setActiveTab(tabId);

    setTimeout(() => {
      if (tabId === "all") {
        setVisiblePosts(posts || []);
      } else {
        const filtered = posts?.filter((post) =>
          post.categories?.some(
            (cat) => cat.name.toLowerCase() === tabId.toLowerCase()
          )
        );
        setVisiblePosts(filtered || []);
      }
      setIsLoading(false);
    }, 300);
  };

  return (
    <section
      id="featured-posts-section"
      className="py-16 md:py-24 md:px-24 bg-white"
    >
      <div className="container mx-auto px-4">
        <div
          className={`transition-all duration-700 ease-out transform ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-blue-600 font-medium mb-2 block">
                Curated Content
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Articles
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl">
                Explore our handpicked selection of the best content from our
                writers. Discover trending topics and thought-provoking ideas.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Link
                href="/blogs"
                className="group inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
              >
                View All Articles
                <svg
                  className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="relative mb-10 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleTabChange(category.id)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeTab === category.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                  {activeTab === category.id && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Gradient fade for scroll indication */}
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>

          {/* Posts Grid with Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {isLoading ? (
              Array(6)
                .fill()
                .map((_, idx) => (
                  <div
                    key={idx}
                    className="opacity-0 animate-fadeIn"
                    style={{
                      animationDelay: `${idx * 100}ms`,
                      animationFillMode: "forwards",
                    }}
                  >
                    <PostCardSkeleton />
                  </div>
                ))
            ) : visiblePosts.length > 0 ? (
              visiblePosts.map((post, idx) => (
                <div
                  key={post._id}
                  className="opacity-0 animate-fadeIn"
                  style={{
                    animationDelay: `${idx * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <PostCard post={post} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">
                  No posts found
                </h3>
                <p className="mt-1 text-gray-500">
                  We couldn&apos;t find any posts in this category. Try another
                  category or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
