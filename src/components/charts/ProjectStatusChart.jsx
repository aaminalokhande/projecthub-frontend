import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ProjectStatusChart({ projects }) {
  const data = {
    labels: ["Active", "Completed", "On Hold"],
    datasets: [
      {
        label: "Projects",
        data: [
          projects.filter((p) => p.status === "active").length,
          projects.filter((p) => p.status === "completed").length,
          projects.filter((p) => p.status === "on_hold").length,
        ],
        backgroundColor: [
          "#3b82f6", // Blue
          "#22c55e", // Green
          "#f59e0b", // Orange
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="chart-card">
      <h3>Project Status</h3>

      <Bar data={data} options={options} />
    </div>
  );
}

export default ProjectStatusChart;