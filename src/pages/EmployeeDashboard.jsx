import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks } from "../services/api";
import { updateTaskStatus } from "../services/api";

function EmployeeDashboard() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});

  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err.message);
    }
  };

  const handleStatusUpdate = async (taskId) => {
  try {
    await updateTaskStatus(
  taskId,
  selectedStatus[taskId] || tasks.find(t => t.id === taskId)?.status
);

alert("Task status updated successfully!");
fetchTasks(); // Reload tasks after update
  } catch (err) {
    alert(err.message);
  }
};

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <h1>Employee Dashboard</h1>
            <p>Welcome, {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>

        <div className="dashboard-section">
          <h2>My Assigned Tasks</h2>

          {tasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div key={task.id} className="task-card">
  <h3>{task.title}</h3>

  <p>{task.description}</p>

  <p><strong>Status:</strong> {task.status}</p>

  <p><strong>Priority:</strong> {task.priority}</p>

  <p><strong>Due:</strong> {task.due_date}</p>

  <p><strong>Project ID:</strong> {task.project_id}</p>

  <select
    value={selectedStatus[task.id] || task.status}
    onChange={(e) =>
      setSelectedStatus({
        ...selectedStatus,
        [task.id]: e.target.value,
      })
    }
  >
    <option value="pending">Pending</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>

  <button onClick={() => handleStatusUpdate(task.id)}>
    Update Status
  </button>
</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;