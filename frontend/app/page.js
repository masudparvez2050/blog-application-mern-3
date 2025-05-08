"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useInView } from "react-intersection-observer";
import HeroSection from "./components/home/HeroSection";
import FeaturedPostsSection from "./components/home/FeaturedPostsSection";
import RecentPostsSection from "./components/home/RecentPostsSection";
import CallToActionSection from "./components/home/CallToActionSection";
<<<<<<< HEAD
=======
import "@/app/globals.css";

>>>>>>> 315e87c (:message)

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

      // Fetch featured posts - now using isFeatured=true filter to get only posts marked as featured
      const featuredResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=3&isFeatured=true`
      );

      // Fetch recent posts - using limit=6 and sort by date for recent posts (increased from 3)
      const recentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts?limit=6&sort=createdAt`
      );

      if (!featuredResponse.ok) {
        throw new Error("Failed to fetch featured posts");
      }

      if (!recentResponse.ok) {
        throw new Error("Failed to fetch recent posts");
      }

      const featuredData = await featuredResponse.json();
      const recentData = await recentResponse.json();

      // Extract posts array from response
      setFeaturedPosts(featuredData.posts || []);
      setRecentPosts(recentData.posts || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err.message);

      // Load fallback data if API fails
      import("@/app/data/mockPosts").then((module) => {
        setFeaturedPosts(module.mockFeaturedPosts);
        setRecentPosts(module.mockRecentPosts);
      });
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

<<<<<<< HEAD
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
=======
 
>>>>>>> 315e87c (:message)
    </>
  );
}
