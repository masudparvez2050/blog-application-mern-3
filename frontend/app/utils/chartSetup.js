"use client";

import { Chart, registerables } from 'chart.js';

// Register all the components needed for charts
Chart.register(...registerables);

// Export Chart for any component that might need direct access
export default Chart;
