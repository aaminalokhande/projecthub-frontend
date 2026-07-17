import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  createTask,
  getProjects,
  getTasks,
  updateTask,
  deleteTask,
} from "../services/api";

function TeamLeadDashboard() {
  const { user, token, logout } = useAuth();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [sortBy, setSortBy] = useState("none");

const ITEMS_PER_PAGE = 5;

const [projectPage, setProjectPage] = useState(1);
const [taskPage, setTaskPage] = useState(1);
const [loadingProjects, setLoadingProjects] = useState(true);
const [loadingTasks, setLoadingTasks] = useState(true);
const [submitting, setSubmitting] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
    project_id: "",
    assigned_to: "",
  });

  const [taskMessage, setTaskMessage] = useState("");
  const [taskError, setTaskError] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);

const emptyTaskForm = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  due_date: "",
  project_id: "",
  assigned_to: "",
};

  const fetchProjects = async () => {
  try {
    setLoadingProjects(true);

    const data = await getProjects(token);
    setProjects(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingProjects(false);
  }
};

  const fetchTasks = async () => {
  try {
    setLoadingTasks(true);

    const data = await getTasks(token);
    setTasks(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoadingTasks(false);
  }
};

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchTasks();
    }
  }, [token]);

  const handleTaskChange = (e) => {
    setTaskForm({
      ...taskForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setTaskMessage("");
    setTaskError("");
    setSubmittinf(true);

    try {
      const payload = {
        ...taskForm,
        project_id: Number(taskForm.project_id),
        assigned_to: taskForm.assigned_to ? Number(taskForm.assigned_to) : null,
      };

      if (editingTaskId) {
    await updateTask(editingTaskId, payload, token);
    setTaskMessage("Task updated successfully!");
} else {
    await createTask(payload, token);
    setTaskMessage("Task created successfully!");
}

      setTaskForm(emptyTaskForm);
setEditingTaskId(null);

      fetchTasks();
    } catch (err) {
      setTaskError(err.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };


const handleEditTask = (task) => {
  setEditingTaskId(task.id);

  setTaskForm({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    due_date: task.due_date || "",
    project_id: task.project_id,
    assigned_to: task.assigned_to || "",
  });
};

const handleDeleteTask = async (taskId) => {
  if (!window.confirm("Delete this task?")) return;

  try {
    await deleteTask(taskId, token);
    fetchTasks();
  } catch (err) {
    alert(err.message);
  }
};

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

const paginatedProjects = projects.slice(
  (projectPage - 1) * ITEMS_PER_PAGE,
  projectPage * ITEMS_PER_PAGE
);

const paginatedTasks = sortedTasks.slice(
  (taskPage - 1) * ITEMS_PER_PAGE,
  taskPage * ITEMS_PER_PAGE
);

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div className="dashboard-section">
  <h2>Dashboard Overview</h2>

  <div className="stats-grid">

    <div className="stat-card">
      <h3>Assigned Projects</h3>
      <p>{projects.length}</p>
    </div>

    <div className="stat-card">
      <h3>Total Tasks</h3>
      <p>{tasks.length}</p>
    </div>

    <div className="stat-card">
      <h3>Completed</h3>
      <p>{tasks.filter(task => task.status === "completed").length}</p>
    </div>

    <div className="stat-card">
      <h3>Pending</h3>
      <p>{tasks.filter(task => task.status === "pending").length}</p>
    </div>

  </div>
</div>
          <div>
            <h1>Team Lead Dashboard</h1>
            <p>Welcome, {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* CREATE TASK */}
        <div className="dashboard-section">
          <h2>Create Task</h2>
          <form onSubmit={handleTaskSubmit} className="dashboard-form">
            <input
              type="text"
              name="title"
              placeholder="Task title"
              value={taskForm.title}
              onChange={handleTaskChange}
              required
            />

            <textarea
              name="description"
              placeholder="Task description"
              value={taskForm.description}
              onChange={handleTaskChange}
              required
            />

            <select
              name="status"
              value={taskForm.status}
              onChange={handleTaskChange}
            >
              <option value="pending">pending</option>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
            </select>

            <select
              name="priority"
              value={taskForm.priority}
              onChange={handleTaskChange}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>

            <input
              type="date"
              name="due_date"
              value={taskForm.due_date}
              onChange={handleTaskChange}
              required
            />

            <input
              type="number"
              name="project_id"
              placeholder="Project ID"
              value={taskForm.project_id}
              onChange={handleTaskChange}
              required
            />

            <input
              type="number"
              name="assigned_to"
              placeholder="Assign to Employee ID (optional)"
              value={taskForm.assigned_to}
              onChange={handleTaskChange}
            />

            <button
  type="submit"
  disabled={submitting}
>
  {submitting
    ? "Saving..."
    : editingTaskId
      ? "Update Task"
      : "Create Task"}
</button>
{editingTaskId && (
  <button
    type="button"
    onClick={() => {
      setEditingTaskId(null);
      setTaskForm(emptyTaskForm);
    }}
  >
    Cancel
  </button>
)}
          </form>

          {taskMessage && <p className="success-text">{taskMessage}</p>}
          {taskError && <p className="error-text">{taskError}</p>}
        </div>

        {/* PROJECTS */}
        <div className="dashboard-section">
          {loadingProjects ? (
  <p>Loading projects...</p>
) : paginatedProjects.length === 0 ? (
  <p>No projects assigned.</p>
) : (
            <div className="project-list">
              {paginatedProjects.map((project) => (
                <div key={project.id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  <p><strong>Due:</strong> {project.due_date}</p>
                </div>
              ))}
            </div>
          )}
        </div>

<div className="pagination">
  <button
    onClick={() => setProjectPage(projectPage - 1)}
    disabled={projectPage === 1}
  >
    Previous
  </button>

  <span>
    Page {projectPage} of {Math.ceil(projects.length / ITEMS_PER_PAGE)}
  </span>

  <button
    onClick={() => setProjectPage(projectPage + 1)}
    disabled={
      projectPage ===
      Math.ceil(projects.length / ITEMS_PER_PAGE)
    }
  >
    Next
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

        {/* TASKS */}
        <div className="dashboard-section">
          {loadingTasks ? (
  <p>Loading tasks...</p>
) : paginatedTasks.length === 0 ? (
  <p>No tasks found.</p>
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
                  <p><strong>Assigned To:</strong> {task.assigned_to ?? "Not assigned"}</p>
                  <div className="action-buttons">
  <button
    className="edit-btn"
    onClick={() => handleEditTask(task)}
  >
    Edit Task
  </button>

  <button
    className="delete-btn"
    onClick={() => handleDeleteTask(task.id)}
  >
    Delete Task
  </button>
</div>
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
    Page {taskPage} of {Math.ceil(sortedTasks.length / ITEMS_PER_PAGE)}
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

export default TeamLeadDashboard;