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

function TaskPriorityChart({ tasks }) {
  const data = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Tasks",
        data: [
          tasks.filter((t) => t.priority === "high").length,
          tasks.filter((t) => t.priority === "medium").length,
          tasks.filter((t) => t.priority === "low").length,
        ],
        backgroundColor: [
          "#ef4444", // High - Red
          "#f59e0b", // Medium - Orange
          "#22c55e", // Low - Green
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
      <h3>Task Priority</h3>

      <Bar data={data} options={options} />
    </div>
  );
}

export default TaskPriorityChart;