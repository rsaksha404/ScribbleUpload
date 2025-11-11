const API_URL = "https://scribbleupload.onrender.com"; // backend base URL // backend base URL
let authToken = localStorage.getItem("token") || null;

// ---------- USER REGISTRATION ----------
async function registerUser(e) {
  e.preventDefault();

  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();

  const res = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Registration successful! You can log in now.");
  } else {
    alert(data.message || "Registration failed!");
  }
}

// ---------- USER LOGIN ----------
async function loginUser(e) {
  e.preventDefault();

  const usernameOrEmail = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const res = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usernameOrEmail, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    authToken = data.token;
    alert("Login successful!");
    showDashboard();
  } else {
    alert(data.message || "Login failed!");
  }
}

// ---------- FILE UPLOAD ----------
async function uploadFile(e) {
  e.preventDefault();
  const fileInput = document.getElementById("upload-file");
  if (!fileInput.files.length) return alert("Please select a file!");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData
  });

  const data = await res.json();
  if (res.ok) {
    alert("File uploaded successfully!");
    loadUserFiles();
  } else {
    alert(data.message || "Upload failed!");
  }
}

// ---------- LOAD USER FILES ----------
async function loadUserFiles() {
  const res = await fetch(`${API_URL}/files`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
  const files = await res.json();

  const list = document.getElementById("file-list");
  list.innerHTML = "";

  if (files.length === 0) {
    list.innerHTML = "<p>No files uploaded yet.</p>";
  } else {
    files.forEach(file => {
      const div = document.createElement("div");
      div.classList.add("file-item");
      div.innerHTML = `
        <p><strong>${file.originalName}</strong> (${(file.size / 1024).toFixed(1)} KB)</p>
        <button onclick="downloadFile('${file._id}')">Download</button>
      `;
      list.appendChild(div);
    });
  }
}

// ---------- DOWNLOAD FILE ----------
function downloadFile(id) {
  window.location.href = `${API_URL}/files/${id}/download`;
}

// ---------- LOGOUT ----------
function logoutUser() {
  localStorage.removeItem("token");
  authToken = null;
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("auth-section").style.display = "block";
}

// ---------- DASHBOARD VIEW ----------
function showDashboard() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  loadUserFiles();
}

// ---------- AUTO-LOGIN CHECK ----------
window.onload = () => {
  if (authToken) {
    showDashboard();
  }
};
