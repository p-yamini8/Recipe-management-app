const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId"); // current logged in user
if (!token) {
  window.location.href = "../login/login.html";
}

async function loadFeed() {
  const res = await fetch("/feed", {
    headers: { "Authorization": `Bearer ${token}`}
  });
  const feedItems = await res.json();

  const feedList = document.getElementById("activity-feed");
  feedList.innerHTML = "";

  feedItems.forEach(item => {
  if (item.type === "recipe") {
    feedList.innerHTML += `
      <li>
        <strong>${item.user}</strong> added a new recipe 🍲 <em>"${item.recipe}"</em>
      </li>
    `;
  } else if (item.type === "review") {
    feedList.innerHTML += `
      <li>
        <strong>${item.user}</strong> reviewed <em>"${item.recipe}"</em>: "${item.comment}" 💬
      </li>
    `;
  }
});

}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "../login/login.html";
});

loadFeed();




    const container = document.getElementById("users-list");
// Load users
async function loadUsers() {
  try {
    const res = await fetch("/user", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const users = await res.json();

    const container = document.getElementById("users-list");
    container.innerHTML = "";

   users.forEach(user => {
  if (user.id == userId) return;

  const div = document.createElement("div");
  div.classList.add("user-card");
  div.innerHTML = `
    <p>👤 ${user.name} (${user.email})</p>
    <button class="follow-btn" data-user-id="${user.id}">
      ${user.isFollowing ? "Unfollow" : "Follow"}
    </button>
  `;
  container.appendChild(div);
});

  } catch (err) {
    console.error("Error loading users:", err);
  }
}

async function toggleFollow(userId, isFollowing) {
  try {
    const method = isFollowing ? "DELETE" : "POST";
    const url = `/follow/${userId}`;

    const res = await fetch(url, {
      method,
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();
    alert(data.message);

    loadUsers();
    loadFeed(); // refresh feed after follow/unfollow
  } catch (err) {
    console.error("Error following/unfollowing:", err);
  }
}


// Load on page start
loadUsers()

container.addEventListener("click", async (e) => {
  if (e.target.classList.contains("follow-btn")) {
    const targetId = e.target.getAttribute("data-user-id");
    const isFollowing = e.target.textContent === "Unfollow";
    await toggleFollow(targetId, isFollowing);
   
  }
});



