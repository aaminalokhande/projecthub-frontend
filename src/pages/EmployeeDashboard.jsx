import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getTasks } from "../services/api";
import { updateTaskStatus } from "../services/api";

function EmployeeDashboard() {
  const { user, token, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [sortBy, setSortBy] = useState("none");

const ITEMS_PER_PAGE = 5;

const [taskPage, setTaskPage] = useState(1);

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

  const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "all" || task.status === statusFilter;

  return matchesSearch && matchesStatus;
});

const sortedTasks = [...filteredTasks].sort((a, b) => {
  switch (sortBy) {
    case "title":
      return a.title.localeCompare(b.title);

    case "priority": {
      const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3,
      };

      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }

    case "status":
      return a.status.localeCompare(b.status);

    case "due_date":
      return new Date(a.due_date) - new Date(b.due_date);

    default:
      return 0;
  }
});

const paginatedTasks = sortedTasks.slice(
  (taskPage - 1) * ITEMS_PER_PAGE,
  taskPage * ITEMS_PER_PAGE
);

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="dashboard-section">
  <h2>My Progress</h2>

  <div className="stats-grid">

    <div className="stat-card">
      <h3>Assigned Tasks</h3>
      <p>{tasks.length}</p>
    </div>

    <div className="stat-card">
      <h3>Completed</h3>
      <p>{tasks.filter(task => task.status === "completed").length}</p>
    </div>

    <div className="stat-card">
      <h3>In Progress</h3>
      <p>{tasks.filter(task => task.status === "in_progress").length}</p>
    </div>

    <div className="stat-card">
      <h3>Pending</h3>
      <p>{tasks.filter(task => task.status === "pending").length}</p>
    </div>

  </div>
</div>
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
  <h2>Search & Filter Tasks</h2>

  <input
    type="text"
    placeholder="Search by task title..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="all">All</option>
    <option value="pending">Pending</option>
    <option value="in_progress">In Progress</option>
    <option value="completed">Completed</option>
  </select>
</div>

<div className="dashboard-section">
  <h2>Sort Tasks</h2>

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="none">No Sorting</option>
    <option value="title">Title (A-Z)</option>
    <option value="priority">Priority</option>
    <option value="status">Status</option>
    <option value="due_date">Due Date</option>
  </select>
</div>

        <div className="dashboard-section">
          <h2>My Assigned Tasks</h2>

          {paginatedTasks.length === 0 ? (
            <p>No tasks assigned yet.</p>
          ) : (
            <div className="task-list">
              {paginatedTasks.map((task) => (
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

<div className="pagination">
  <button
    onClick={() => setTaskPage(taskPage - 1)}
    disabled={taskPage === 1}
  >
    Previous
  </button>

  <span>
    Page {taskPage} of{" "}
    {Math.ceil(sortedTasks.length / ITEMS_PER_PAGE)}
  </span>

  <button
    onClick={() => setTaskPage(taskPage + 1)}
    disabled={
      taskPage ===
      Math.ceil(sortedTasks.length / ITEMS_PER_PAGE)
    }
  >
    Next
  </button>
</div>

      </div>
    </div>
  );
}

export default EmployeeDashboard;