"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import HeroSection from "./components/home/HeroSection";
import FeaturedPostsSection from "./components/home/FeaturedPostsSection";
import RecentPostsSection from "./components/home/RecentPostsSection";
import CallToActionSection from "./components/home/CallToActionSection";
import { blogApi } from "./services/blogApi";
import ErrorAlert from "./components/shared/ErrorAlert";


export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Create refs for each section with animation threshold
  const [featuredRef, featuredInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [recentRef, recentInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [ctaRef, ctaInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  // Handle scroll progress for animations
  const handleScroll = useCallback(() => {
    const totalScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const currentProgress = Math.min((window.scrollY / totalScroll) * 100, 100);
    setScrollProgress(currentProgress);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);

      // Use Promise.all to fetch both featured and recent posts simultaneously
      const [featuredData, recentData] = await Promise.all([
        blogApi.getPosts({ limit: 3, isFeatured: true }),
        blogApi.getPosts({ limit: 6, sort: "-createdAt" }),
      ]);

      setFeaturedPosts(featuredData.posts || []);
      setRecentPosts(recentData.posts || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(
        err.message || "Failed to load posts. Please try refreshing the page."
      );

      // Load fallback data if API fails
      try {
        const { mockFeaturedPosts, mockRecentPosts } = await import(
          "@/app/data/mockPosts"
        );
        setFeaturedPosts(mockFeaturedPosts);
        setRecentPosts(mockRecentPosts);
      } catch (fallbackError) {
        console.error("Failed to load fallback data:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <>
      {/* Progress indicator */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Main content with perspective effect */}
      <div className="perspective-container bg-gradient-to-b from-white to-slate-50">
        {/* Hero with parallax effect */}
        <div className="transform-gpu will-change-transform">
          <HeroSection />
        </div>

        {/* Display error message if there's an error and no fallback data */}
        {error && !featuredPosts.length && (
          <ErrorAlert message={error} onRetry={fetchPosts} />
        )}

        {/* Featured posts with slide-up animation */}
        <div
          ref={featuredRef}
          className={`transform-gpu transition-all duration-1000 ${
            featuredInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <FeaturedPostsSection
            posts={featuredPosts}
            loading={loading}
            error={error}
            onRetry={fetchPosts}
          />
        </div>

        {/* Recent posts with fade-in animation */}
        <div
          ref={recentRef}
          className={`transform-gpu transition-all duration-1000 delay-300 ${
            recentInView
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
          }`}
        >
          <RecentPostsSection
            posts={recentPosts}
            loading={loading}
            error={error}
            onRetry={fetchPosts}
          />
        </div>

        {/* CTA with scale animation */}
        <div
          ref={ctaRef}
          className={`transform-gpu transition-all duration-1000 delay-500 ${
            ctaInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <CallToActionSection />
        </div>
      </div>

      {/* CSS for additional animations */}
      <style jsx>{`
        .perspective-container {
          perspective: 1000px;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </>
  );
}
