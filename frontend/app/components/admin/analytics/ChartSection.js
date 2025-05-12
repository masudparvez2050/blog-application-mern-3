"use client";

import { Line } from "react-chartjs-2";
import { FaChartLine, FaChartBar } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  chartOptions,
  createChartData,
  contentGrowthDatasets,
  engagementDatasets,
} from "../../../utils/chartConfig";
// Import Chart.js setup to register all required components
import "../../../utils/chartSetup";

const ChartSection = ({ analytics }) => {
  const labels = analytics.postsPerMonth?.map((item) => item.month) || [];

  const contentGrowthData = createChartData(
    labels,
    contentGrowthDatasets(analytics)
  );

  const engagementData = createChartData(labels, engagementDatasets(analytics));

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Content Growth Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FaChartLine className="mr-2 h-5 w-5 text-indigo-500" />
          Content Growth
        </h2>
        <div className="h-80">
          <Line options={chartOptions} data={contentGrowthData} />
        </div>
      </motion.div>

      {/* Engagement Chart */}
      <motion.div
        variants={itemVariants}
        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <FaChartBar className="mr-2 h-5 w-5 text-amber-500" />
          User Engagement
        </h2>
        <div className="h-80">
          <Line options={chartOptions} data={engagementData} />
        </div>
      </motion.div>
    </div>
  );
};

export default ChartSection;
