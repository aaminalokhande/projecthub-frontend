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
      const data = await getProjects(token);
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await getTasks(token);
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks:", err.message);
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

      setTaskMessage("Task created successfully!");
      setTaskForm(emptyTaskForm);
setEditingTaskId(null);

      fetchTasks();
    } catch (err) {
      setTaskError(err.message || "Failed to create task");
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


  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="dashboard-header">
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

            <button type="submit">
  {editingTaskId ? "Update Task" : "Create Task"}
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
          <h2>My Assigned Projects</h2>
          {projects.length === 0 ? (
            <p>No projects assigned.</p>
          ) : (
            <div className="project-list">
              {projects.map((project) => (
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

        {/* TASKS */}
        <div className="dashboard-section">
          <h2>Tasks For My Projects</h2>
          {tasks.length === 0 ? (
            <p>No tasks found for your projects.</p>
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
      </div>
    </div>
  );
}

export default TeamLeadDashboard;