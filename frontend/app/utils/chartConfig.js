export const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(17, 24, 39, 0.9)",
      titleColor: "#fff",
      bodyColor: "#fff",
      padding: 12,
      borderColor: "rgba(255, 255, 255, 0.1)",
      borderWidth: 1,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      usePointStyle: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(107, 114, 128, 0.1)",
      },
    },
    x: {
      grid: {
        color: "rgba(107, 114, 128, 0.05)",
      },
    },
  },
  elements: {
    point: {
      radius: 4,
      hoverRadius: 6,
    },
    line: {
      borderWidth: 3,
    },
  },
};

export const createChartData = (labels, datasets) => ({
  labels,
  datasets: datasets.map(dataset => ({
    ...dataset,
    tension: 0.3,
  })),
});

export const contentGrowthDatasets = (analytics) => [
  {
    label: "Posts",
    data: analytics.postsPerMonth?.map((item) => item.count) || [],
    borderColor: "rgb(79, 70, 229)",
    backgroundColor: "rgba(79, 70, 229, 0.5)",
  },
  {
    label: "Comments",
    data: analytics.commentsPerMonth?.map((item) => item.count) || [],
    borderColor: "rgb(147, 51, 234)",
    backgroundColor: "rgba(147, 51, 234, 0.5)",
  },
  {
    label: "Users",
    data: analytics.usersPerMonth?.map((item) => item.count) || [],
    borderColor: "rgb(16, 185, 129)",
    backgroundColor: "rgba(16, 185, 129, 0.5)",
  },
];

export const engagementDatasets = (analytics) => [
  {
    label: "Views",
    data: analytics.viewsPerMonth?.map((item) => item.count) || [],
    borderColor: "rgb(245, 158, 11)",
    backgroundColor: "rgba(245, 158, 11, 0.5)",
  },
  {
    label: "Likes",
    data: analytics.likesPerMonth?.map((item) => item.count) || [],
    borderColor: "rgb(239, 68, 68)",
    backgroundColor: "rgba(239, 68, 68, 0.5)",
  },
];
