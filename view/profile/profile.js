const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login/login.html";
}

async function loadProfile() {
  const res = await fetch("/profile", {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();
console.log('data',data)
  document.getElementById("profile-username").innerText = data.name;
  document.getElementById("profile-email").innerText = data.email;
  document.getElementById("profile-joined").innerText = new Date(data.createdAt).toLocaleDateString();

  // My Recipes
  const recipeDiv = document.getElementById("my-recipes");
  recipeDiv.innerHTML = "";

  data.Recipes.forEach(r => {
 
    recipeDiv.innerHTML += `<div class="card"><h4>${r.title}</h4><p>${r.ingredients}</p><p>${r.instructions}</p></div>`;
  });

  // My Favorites
  const favDiv = document.getElementById("my-favorites");
  favDiv.innerHTML = "";
  data.Favorites.forEach(f => {
    favDiv.innerHTML += `<div class="card"><h4>${f.Recipe.title}</h4></div>`;
  });

  // Following
  const followingList = document.getElementById("following-list");
  followingList.innerHTML = "";
  data.Following.forEach(f => {
    followingList.innerHTML += `<li>${f.name}</li>`;
  });

  // Followers
  const followersList = document.getElementById("followers-list");
  followersList.innerHTML = "";
  data.Followers.forEach(f => {
    followersList.innerHTML += `<li>${f.name}</li>`;
  });
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../login/login.html";
});

loadProfile();