"use client";

import { useState, useEffect } from "react";
import HeroSection from "./components/home/HeroSection";
import FeaturedPostsSection from "./components/home/FeaturedPostsSection";
import RecentPostsSection from "./components/home/RecentPostsSection";
import CallToActionSection from "./components/home/CallToActionSection";

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        // Fetch featured posts - using limit=3 and sort by views for featured posts
        const featuredResponse = await fetch(
          "http://localhost:5000/api/posts?limit=3&sort=views"
        );

        // Fetch recent posts - using limit=3 and sort by date for recent posts
        const recentResponse = await fetch(
          "http://localhost:5000/api/posts?limit=3&sort=createdAt"
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
    };

    fetchPosts();
  }, []);

  return (
    <div className="pt-16">
      <HeroSection />

      <FeaturedPostsSection
        posts={featuredPosts}
        loading={loading}
        error={error}
      />

      <RecentPostsSection posts={recentPosts} loading={loading} error={error} />

      <CallToActionSection />
    </div>
  );
}
