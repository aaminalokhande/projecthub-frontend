import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function TaskStatusChart({ tasks }) {

  const data = {
    labels: [
      "Pending",
      "In Progress",
      "Completed",
    ],
    datasets: [
  {
    data: [
      tasks.filter((t) => t.status === "pending").length,
      tasks.filter((t) => t.status === "in_progress").length,
      tasks.filter((t) => t.status === "completed").length,
    ],

    backgroundColor: [
      "#f59e0b", // Pending - Orange
      "#3b82f6", // In Progress - Blue
      "#22c55e", // Completed - Green
    ],

    borderColor: [
      "#f59e0b",
      "#3b82f6",
      "#22c55e",
    ],

    borderWidth: 1,
  },
],
  };

  return (
    <div className="chart-card">
  <h3>Task Status</h3>

  <div style={{ width: "350px", margin: "0 auto" }}>
    <Pie data={data} />
  </div>
</div>
  );
}

export default TaskStatusChart;