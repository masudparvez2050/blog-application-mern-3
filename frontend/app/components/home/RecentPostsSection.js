"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import PostCard from "../shared/PostCard";
import PostCardSkeleton from "../shared/PostCardSkeleton";
import Image from "next/image";

export default function RecentPostsSection({ posts }) {
  const [isLoading, setIsLoading] = useState(true);
  const [displayPosts, setDisplayPosts] = useState([]);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    // Simulate loading for smoother transitions
    const timer = setTimeout(() => {
      setIsLoading(false);
      setDisplayPosts(posts || []);
    }, 600);

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

    const section = document.getElementById("recent-posts-section");
    if (section) {
      observer.observe(section);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [posts]);

  return (
    <section id="recent-posts-section" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div
          className={`transition-all duration-700 ease-out transform ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <span className="text-blue-600 font-medium mb-2 block">
                Latest Updates
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Recent Publications
              </h2>
              <p className="text-gray-600 mt-3 max-w-2xl">
                Stay updated with our freshest content. Discover the latest
                perspectives, insights, and trending topics from our
                contributors.
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

          <div className="relative">
            {/* Large featured post */}
            <div className="mb-8">
              {isLoading ? (
                <div className="aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden bg-gray-200 animate-pulse"></div>
              ) : displayPosts.length > 0 ? (
                <Link
                  href={`/blogs/${displayPosts[0]._id}`}
                  className="group block"
                >
                  <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden transition-transform duration-300 group-hover:shadow-xl">
                    <Image
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      src={
                        displayPosts[0].coverImage ||
                        "https://placehold.co/1200x630?text=Featured+Post"
                      }
                      alt={displayPosts[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                      <div className="absolute bottom-0 left-0 p-6 md:p-8">
                        {displayPosts[0].categories?.slice(0, 1).map((cat) => (
                          <span
                            key={cat._id}
                            className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full"
                          >
                            {cat.name}
                          </span>
                        ))}
                        <h3 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                          {displayPosts[0].title}
                        </h3>
                        <p className="mt-2 text-gray-200 line-clamp-2 max-w-3xl">
                          {displayPosts[0].excerpt ||
                            displayPosts[0].content?.substring(0, 150) + "..."}
                        </p>
                        <div className="mt-4 flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                            <Image
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              src={
                                displayPosts[0].author?.avatar ||
                                "https://placehold.co/100?text=A"
                              }
                              alt={displayPosts[0].author?.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-2">
                            <p className="text-sm font-medium text-white">
                              {displayPosts[0].author?.name || "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-300">
                              {new Date(
                                displayPosts[0].createdAt
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : null}
            </div>

            {/* Recent posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {isLoading
                ? Array(6)
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
                : displayPosts.slice(1).map((post, idx) => (
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
                  ))}
            </div>

            {/* Empty state */}
            {!isLoading && displayPosts.length === 0 && (
              <div className="py-16 text-center bg-white rounded-xl shadow-sm">
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">
                  No recent posts
                </h3>
                <p className="mt-1 text-gray-500">
                  Check back soon for new content from our authors.
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
      `}</style>
    </section>
  );
}
