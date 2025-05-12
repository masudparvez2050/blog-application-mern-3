"use client";

import { FaUsers, FaNewspaper, FaEye, FaThumbsUp } from "react-icons/fa";
import useAnalytics from "../../hooks/useAnalytics";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import PageHeader from "../../components/admin/analytics/PageHeader";
import TimeRangeFilter from "../../components/admin/analytics/TimeRangeFilter";
import StatCard from "../../components/admin/analytics/StatCard";
import ChartSection from "../../components/admin/analytics/ChartSection";
import TopPosts from "../../components/admin/analytics/TopPosts";
import CategoryStats from "../../components/admin/analytics/CategoryStats";
import { motion } from "framer-motion";

const iconMapping = {
  "Total Users": FaUsers,
  "Total Posts": FaNewspaper,
  "Total Views": FaEye,
  "Total Likes": FaThumbsUp,
};

export default function AdminAnalytics() {
  const { analytics, isLoading, timeRange, setTimeRange, statCards } = useAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="space-y-6">
        <PageHeader />
        <TimeRangeFilter timeRange={timeRange} setTimeRange={setTimeRange} />

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {statCards.map((stat) => (
            <StatCard
              key={stat.title}
              icon={iconMapping[stat.title]}
              {...stat}
            />
          ))}
        </motion.div>

        {/* Charts */}
        <ChartSection analytics={analytics} />

        {/* Top Posts */}
        <TopPosts posts={analytics.topPosts} />

        {/* Category Stats */}
        <CategoryStats categories={analytics.categoryStats} />
      </div>
    </ProtectedRoute>
  );
}
