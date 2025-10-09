const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login/login.html";
}

async function loadUsers() {
  const res = await fetch("/admin/users", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const users = await res.json();

  const tbody = document.getElementById("user-table");
  tbody.innerHTML = "";
  users.forEach(u => {
    const status = u.banned ? "Banned" : "Active";
    tbody.innerHTML += `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${status}</td>
        <td>
          ${u.banned 
            ? `<button onclick="approveUser(${u.id})">Approve</button> `
            : `<button onclick="banUser(${u.id})">Ban</button>`
          }
        </td>
      </tr>
    `;
  });
}

async function loadRecipes() {
  const res = await fetch("/admin/recipes", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const recipes = await res.json();
console.log(recipes)
  const tbody = document.getElementById("recipe-table");
  tbody.innerHTML = "";
  recipes.forEach(r => {
    tbody.innerHTML += `
      <tr>
        <td>${r.title}</td>
        <td>${r.User?.name || "Unknown"}</td>
        <td><button onclick="deleteRecipe(${r.id})">Delete</button></td>
      </tr>
    `;
  });
}

async function banUser(id) {
  await fetch(`/admin/ban/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });
  loadUsers();
}

async function approveUser(id) {
  await fetch(`/admin/approve/${id}`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });
  loadUsers();
}

async function deleteRecipe(id) {
  await fetch(`/admin/recipe/${id}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` }
  });
  loadRecipes();
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../login/login.html";
});

// Load data
loadUsers();
loadRecipes();