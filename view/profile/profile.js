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
//edit profile
const editprofile = document.getElementById('editProfileBtn');
const editModal = document.getElementById('editModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveProfileBtn = document.getElementById('saveProfileBtn');

editprofile.addEventListener('click', () => {
  // Pre-fill existing values
  document.getElementById('edit-name').value = document.getElementById('profile-username').innerText;
  document.getElementById('edit-email').value = document.getElementById('profile-email').innerText;
  editModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
  editModal.classList.add('hidden');
});

// Save Updated Profile
saveProfileBtn.addEventListener('click', async () => {
  const name = document.getElementById('edit-name').value;
  const email = document.getElementById('edit-email').value;
  const number = document.getElementById('edit-number').value;

  const res = await fetch('/profile/update', {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, email, number })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Profile Updated Successfully ✅");
    // Update UI without reload
    document.getElementById('profile-username').innerText = name;
    document.getElementById('profile-email').innerText = email;
    editModal.classList.add('hidden');
  } else {
    alert(data.message || "Something went wrong!");
  }
});
