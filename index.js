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
      </td>
    `;
    tbody.appendChild(row);
  });

  localStorage.setItem("users", JSON.stringify(users));
}

// Función para mostrar el historial de asistencia
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
        </tr>
      </thead>
      <tbody>
        ${attendance
          .map(
            (a) => `
          <tr>
            <td>${a.name}</td>
            <td>${a.email}</td>
            <td>${a.date}</td>
            <td>${a.status}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

// Botón para mostrar el historial
document.getElementById("show-history").addEventListener("click", renderAttendanceHistory);

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
renderUsers();
