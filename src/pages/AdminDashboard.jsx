import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    getTasks,
    updateTask,
    deleteTask,
} from "../services/api";

function AdminDashboard() {
  const { user, token, logout } = useAuth();

  // ---------------- PROJECT STATE ----------------
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    status: "active",
    start_date: "",
    due_date: "",
    team_lead_id: "",
  });

  const [projects, setProjects] = useState([]);
  const [projectMessage, setProjectMessage] = useState("");
  const [projectError, setProjectError] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // ---------------- TASK STATE ----------------
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: "",
    project_id: "",
    assigned_to: "",
  });

  const [tasks, setTasks] = useState([]);
  const [taskMessage, setTaskMessage] = useState("");
  const [taskError, setTaskError] = useState("");

  // ---------------- FETCH DATA ----------------
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

  // ---------------- PROJECT HANDLERS ----------------
  const handleProjectChange = (e) => {
    setProjectForm({
      ...projectForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProjectSubmit = async (e) => {
  e.preventDefault();

  setProjectMessage("");
  setProjectError("");

  try {
    const payload = {
      ...projectForm,
      team_lead_id: projectForm.team_lead_id
        ? Number(projectForm.team_lead_id)
        : null,
    };

    if (editingProject) {
      await updateProject(editingProject.id, payload, token);
      setProjectMessage("Project updated successfully!");
    } else {
      await createProject(payload, token);
      setProjectMessage("Project created successfully!");
    }

    setProjectForm({
      title: "",
      description: "",
      status: "active",
      start_date: "",
      due_date: "",
      team_lead_id: "",
    });

    setEditingProject(null);

    fetchProjects();
  } catch (err) {
    setProjectError(err.message || "Operation failed");
  }
};


  const handleDeleteProject = async (projectId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmDelete) return;

  try {
    await deleteProject(projectId, token);

    setProjectMessage("Project deleted successfully!");
    setProjectError("");

    fetchProjects();
  } catch (err) {
    setProjectError(err.message);
    setProjectMessage("");
  }
};

  // ---------------- TASK HANDLERS ----------------
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
      setTaskForm({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: "",
        project_id: "",
        assigned_to: "",
      });

      fetchTasks();
      await fetchTasks();
      setEditingTaskId(null);
    } catch (err) {
      setTaskError(err.message || "Task operation failed.");
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

    setTaskMessage("Task deleted successfully!");
    setTaskError("");

    fetchTasks();
  } catch (err) {
    setTaskError(err.message);
    setTaskMessage("");
  }
};

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
          </div>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>

        {/* CREATE PROJECT */}
        <div className="dashboard-section">
          <h2>Create Project</h2>
          <form onSubmit={handleProjectSubmit} className="dashboard-form">
            <input
              type="text"
              name="title"
              placeholder="Project title"
              value={projectForm.title}
              onChange={handleProjectChange}
              required
            />

            <textarea
              name="description"
              placeholder="Project description"
              value={projectForm.description}
              onChange={handleProjectChange}
              required
            />

            <select
              name="status"
              value={projectForm.status}
              onChange={handleProjectChange}
            >
              <option value="active">active</option>
              <option value="planned">planned</option>
              <option value="completed">completed</option>
            </select>

            <input
              type="date"
              name="start_date"
              value={projectForm.start_date}
              onChange={handleProjectChange}
              required
            />

            <input
              type="date"
              name="due_date"
              value={projectForm.due_date}
              onChange={handleProjectChange}
              required
            />

            <input
              type="number"
              name="team_lead_id"
              placeholder="Team Lead ID (optional)"
              value={projectForm.team_lead_id}
              onChange={handleProjectChange}
            />

           <button type="submit">
  {editingProject ? "Update Project" : "Create Project"}
</button>

           {editingProject && (
    <button
      type="button"
      onClick={() => {
        setEditingProject(null);

        setProjectForm({
          title: "",
          description: "",
          status: "active",
          start_date: "",
          due_date: "",
          team_lead_id: "",
        });
      }}
    >
      Cancel
    </button>
  )}


          </form>


          {projectMessage && <p className="success-text">{projectMessage}</p>}
          {projectError && <p className="error-text">{projectError}</p>}
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

      setTaskForm({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: "",
        project_id: "",
        assigned_to: "",
      });
    }}
  >
    Cancel
  </button>
)}
          </form>

          {taskMessage && <p className="success-text">{taskMessage}</p>}
          {taskError && <p className="error-text">{taskError}</p>}
        </div>

        {/* PROJECT LIST */}
        <div className="dashboard-section">
          <h2>Projects</h2>
          {projects.length === 0 ? (
            <p>No projects found.</p>
          ) : (
            <div className="project-list">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  <p><strong>Start:</strong> {project.start_date}</p>
                  <p><strong>Due:</strong> {project.due_date}</p>
                  <p><strong>Team Lead ID:</strong> {project.team_lead_id ?? "Not assigned"}</p>
                  <button
  className="edit-btn"
  onClick={() => {
    setEditingProject(project);

    setProjectForm({
      title: project.title,
      description: project.description,
      status: project.status,
      start_date: project.start_date,
      due_date: project.due_date,
      team_lead_id: project.team_lead_id || "",
    });
  }}
>
  Edit Project
</button>

<button
  className="delete-btn"
  onClick={() => handleDeleteProject(project.id)}
>
  Delete Project
</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TASK LIST */}
        <div className="dashboard-section">
          <h2>All Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;