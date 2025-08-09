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


function markAttendance(index) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const user = users[index];
  const alreadyMarked = attendance.some(
    (a) => a.email === user.email && a.date === today
  );
  if (alreadyMarked) {
    alert("La asistencia de hoy ya fue registrada para este empleado.");
    return;
  }
  attendance.push({
    name: user.name,
    email: user.email,
    date: today,
    status: "Presente",
  });
  localStorage.setItem("attendance", JSON.stringify(attendance));
  alert("Asistencia registrada para hoy.");
  renderAttendanceHistory();
}


function renderAttendanceHistory(filteredAttendance = null) {
  const historyDiv = document.getElementById("attendance-history");
  const data = filteredAttendance || attendance;
  let rowsHtml = "";
  if (data.length === 0) {
    rowsHtml = `<tr><td colspan="5" style="text-align:center;">No se encontraron resultados</td></tr>`;
  } else {
    rowsHtml = data
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
      .join("");
  }
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
        ${rowsHtml}
      </tbody>
    </table>
  `;
}



function editAttendanceDate(index, newDate) {
  const today = new Date().toISOString().slice(0, 10);
  if (!newDate || newDate > today) {
    alert("La fecha no puede estar vacía ni ser futura.");
    renderAttendanceHistory();
    return;
  }
  attendance[index].date = newDate;
  localStorage.setItem("attendance", JSON.stringify(attendance));
  renderAttendanceHistory();
}



function deleteAttendance(index) {
  attendance.splice(index, 1);
  localStorage.setItem("attendance", JSON.stringify(attendance));
  renderAttendanceHistory();
}


function addUser(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) {
    alert("Todos los campos son obligatorios.");
    return;
  }

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
  localStorage.setItem("users", JSON.stringify(users));
  renderUsers();
}


function editUser(index) {
  const user = users[index];
  document.getElementById("name").value = user.name;
  document.getElementById("email").value = user.email;
  editIndex = index;
}


function filterAttendance() {
  const nameValue = document.getElementById("filter-name").value.trim().toLowerCase();
  const dateValue = document.getElementById("filter-date").value;
  let filtered = attendance;

  if (nameValue) {
    filtered = filtered.filter(
      a =>
        a.name.toLowerCase().includes(nameValue) ||
        a.email.toLowerCase().includes(nameValue)
    );
  }
  if (dateValue) {
    filtered = filtered.filter(a => a.date === dateValue);
  }
  renderAttendanceHistory(filtered);
}


function clearAttendanceFilter() {
  document.getElementById("filter-name").value = "";
  document.getElementById("filter-date").value = "";
  renderAttendanceHistory();
}


function exportAttendanceCSV() {
  if (attendance.length === 0) {
    alert("No hay registros de asistencia para exportar.");
    return;
  }
  const header = ["Nombre", "Email", "Fecha", "Estado"];
  const rows = attendance.map(a => [a.name, a.email, a.date, a.status]);
  let csvContent = header.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "historial_asistencia.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Validar login
document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const username = document.getElementById("login-username").value.trim();
      const password = document.getElementById("login-password").value.trim();
      const errorDiv = document.getElementById("login-error");
      if (!username || !password) {
        errorDiv.textContent = "Credenciales incorrectas";
        errorDiv.style.display = "block";
        return;
      }
      if (username === "admin" && password === "admin123") {
        document.getElementById("login-container").style.display = "none";
        document.getElementById("main-content").style.display = "block";
        errorDiv.style.display = "none";
      } else {
        errorDiv.textContent = "Credenciales incorrectas";
        errorDiv.style.display = "block";
      }
    });
  }
});


document.getElementById("user-form").addEventListener("submit", addUser);
document.getElementById("show-history").addEventListener("click", renderAttendanceHistory);
document.getElementById("apply-filter").addEventListener("click", filterAttendance);
document.getElementById("clear-filter").addEventListener("click", clearAttendanceFilter);
document.getElementById("export-csv").addEventListener("click", exportAttendanceCSV);


renderUsers();
renderAttendanceHistory();
