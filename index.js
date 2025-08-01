<<<<<<< HEAD
let users = JSON.parse(localStorage.getItem("users")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
let editIndex = null;

function renderUsers() {
  const tbody = document.querySelector("#user-table tbody");
  tbody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="editUser(${index})">Editar</button>
        <button onclick="deleteUser(${index})">Eliminar</button>
        <button onclick="markAttendance(${index})">Registrar Asistencia</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  localStorage.setItem("users", JSON.stringify(users));
}

// Registrar asistencia con fecha automática
function markAttendance(index) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const user = users[index];
  attendance.push({
    name: user.name,
    email: user.email,
    date: today,
    status: "Presente",
  });
  localStorage.setItem("attendance", JSON.stringify(attendance));
  alert("Asistencia registrada para hoy.");
}

// Mostrar historial con campo editable de fecha
function renderAttendanceHistory() {
  const historyDiv = document.getElementById("attendance-history");
  historyDiv.innerHTML = `
    <h2>Historial de Asistencia</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${attendance
          .map(
            (a, i) => `
          <tr>
            <td>${a.name}</td>
            <td>${a.email}</td>
            <td>
              <input type="date" value="${a.date}" onchange="editAttendanceDate(${i}, this.value)" />
            </td>
            <td>${a.status}</td>
            <td>
              <button onclick="deleteAttendance(${i})">Eliminar</button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

// Editar la fecha de asistencia
function editAttendanceDate(index, newDate) {
  attendance[index].date = newDate;
  localStorage.setItem("attendance", JSON.stringify(attendance));
  renderAttendanceHistory();
}

// Eliminar registro de asistencia
function deleteAttendance(index) {
  attendance.splice(index, 1);
  localStorage.setItem("attendance", JSON.stringify(attendance));
  renderAttendanceHistory();
}

function addUser(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) return;

  if (editIndex === null) {
    users.push({ name, email });
  } else {
    users[editIndex] = { name, email };
    editIndex = null;
  }

  document.getElementById("user-form").reset();
  renderUsers();
}

function deleteUser(index) {
  users.splice(index, 1);
  renderUsers();
}

function editUser(index) {
  const user = users[index];
  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
  editIndex = index;
}

document.getElementById("user-form").addEventListener("submit", addUser);
document.getElementById("show-history").addEventListener("click", renderAttendanceHistory);
renderUsers();
=======
let users = JSON.parse(localStorage.getItem("users")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
let editIndex = null;

function renderUsers() {
  const tbody = document.querySelector("#user-table tbody");
  tbody.innerHTML = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="editUser(${index})">Editar</button>
        <button onclick="deleteUser(${index})">Eliminar</button>
        <button onclick="markAttendance(${index})">Registrar Asistencia</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  localStorage.setItem("users", JSON.stringify(users));
}

// Registrar asistencia con fecha automática
function markAttendance(index) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const user = users[index];
  attendance.push({
    name: user.name,
    email: user.email,
    date: today,
    status: "Presente",
  });
  localStorage.setItem("attendance", JSON.stringify(attendance));
  alert("Asistencia registrada para hoy.");
}

// Mostrar historial con campo editable de fecha
function renderAttendanceHistory() {
  const historyDiv = document.getElementById("attendance-history");
  historyDiv.innerHTML = `
    <h2>Historial de Asistencia</h2>
    <table border="1">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Email</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        ${attendance
          .map(
            (a, i) => `
          <tr>
            <td>${a.name}</td>
            <td>${a.email}</td>
            <td>
              <input type="date" value="${a.date}" onchange="editAttendanceDate(${i}, this.value)" />
            </td>
            <td>${a.status}</td>
            <td>
              <button onclick="deleteAttendance(${i})">Eliminar</button>
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

// Editar la fecha de asistencia
function editAttendanceDate(index, newDate) {
  attendance[index].date = newDate;
  localStorage.setItem("attendance", JSON.stringify(attendance));
  renderAttendanceHistory();
}

// Eliminar registro de asistencia
function deleteAttendance(index) {
  attendance.splice(index, 1);
  localStorage.setItem("attendance", JSON.stringify(attendance));
  renderAttendanceHistory();
}

function addUser(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) return;

  if (editIndex === null) {
    users.push({ name, email });
  } else {
    users[editIndex] = { name, email };
    editIndex = null;
  }

  document.getElementById("user-form").reset();
  renderUsers();
}

function deleteUser(index) {
  users.splice(index, 1);
  renderUsers();
}

function editUser(index) {
  const user = users[index];
  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
  editIndex = index;
}

document.getElementById("user-form").addEventListener("submit", addUser);
document.getElementById("show-history").addEventListener("click", renderAttendanceHistory);
renderUsers();
>>>>>>> origin/main
