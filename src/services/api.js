const API_BASE_URL = "http://127.0.0.1:8000";

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Registration failed");
  }

  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  return data;
}



export async function getProjects(token) {
  const response = await fetch(`${API_BASE_URL}/projects/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch projects");
  }

  return data;
}

export async function createProject(projectData, token) {
  const response = await fetch(`${API_BASE_URL}/projects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to create project");
  }

  return data;
}


export async function updateProject(projectId, projectData, token) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projectData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update project");
  }

  return data;
}


export async function deleteProject(projectId, token) {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete project");
  }

  return data;
}


export async function createTask(taskData, token) {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Task creation failed");
  }

  return data;
}



export async function getTasks(token) {
  const response = await fetch(`${API_BASE_URL}/tasks/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch tasks");
  }

  return data;
}


export async function updateTaskStatus(taskId, status) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/tasks/${taskId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return await response.json();
}


export async function updateTask(taskId, taskData, token) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to update task");
  }

  return data;
}

export async function deleteTask(taskId, token) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to delete task");
  }

  return data;
}