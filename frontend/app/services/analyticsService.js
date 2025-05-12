import { handleApiError } from '../utils/errorHandler';

export const fetchAnalyticsData = async (timeRange) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics?timeRange=${timeRange}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch analytics data');
    }

    return await response.json();
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
