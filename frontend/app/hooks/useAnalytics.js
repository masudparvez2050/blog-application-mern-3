"use client";

import { useState, useEffect } from "react";
import { fetchAnalyticsData } from "../services/analyticsService";

const useAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    postsPerMonth: [],
    commentsPerMonth: [],
    usersPerMonth: [],
    viewsPerMonth: [],
    likesPerMonth: [],
    topPosts: [],
    categoryStats: [],
    totalUsers: 0,
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    loadAnalytics(timeRange);
  }, [timeRange]);

  const loadAnalytics = async (range) => {
    try {
      setIsLoading(true);
      const data = await fetchAnalyticsData(range);
      setAnalytics(data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: analytics.totalUsers || 0,
      change: "+12%",
      progress: 45,
      gradient: "from-indigo-500 to-blue-600",
      iconBgClass: "bg-indigo-100",
      iconTextClass: "text-indigo-600"
    },
    {
      title: "Total Posts",
      value: analytics.totalPosts || 0,
      change: "+8%",
      progress: 60,
      gradient: "from-green-500 to-emerald-600",
      iconBgClass: "bg-green-100",
      iconTextClass: "text-green-600"
    },
    {
      title: "Total Views",
      value: analytics.totalViews || 0,
      change: "+22%",
      progress: 75,
      gradient: "from-amber-500 to-orange-600",
      iconBgClass: "bg-amber-100",
      iconTextClass: "text-amber-600"
    },
    {
      title: "Total Likes",
      value: analytics.totalLikes || 0,
      change: "+15%",
      progress: 52,
      gradient: "from-purple-500 to-pink-600",
      iconBgClass: "bg-purple-100",
      iconTextClass: "text-purple-600"
    }
  ];

  return {
    analytics,
    isLoading,
    timeRange,
    setTimeRange,
    statCards
  };
};

export default useAnalytics;
