// // ✅ Check if user is logged in
//     const token = localStorage.getItem("token");
//     const username = localStorage.getItem("username");
   

//     if (!token) {
//       window.location.href = "../login/login.html"; // redirect back to login
//     } else {
//       document.getElementById("username").innerText = username;
//     }

//     // ✅ Logout
//     document.getElementById("logoutBtn").addEventListener("click", () => {
//       localStorage.removeItem("token");
//       localStorage.removeItem("username");
//       window.location.href = "../login/login.html";
//     });

//     // ✅ Fetch All Recipes
//     async function loadRecipes() {
//       const res = await fetch("/recipes");
//       const recipes = await res.json();
// console.log(recipes)
//       const container = document.getElementById("recipes");
//       container.innerHTML = "";

//       recipes.forEach(r => {
//         const div = document.createElement("div");
//         div.className = "recipe";
//         div.innerHTML = `
//           <h3>${r.title}</h3>
//           <p><b>By:</b> ${username}</p>
//           <p><b>Ingredients:</b> ${r.ingredients}</p>
//           <p><b>Instructions:</b> ${r.instructions}</p>
//           <p><b>Time:</b> ${r.cookingTime || "-"} mins | <b>Servings:</b> ${r.servings || "-"}</p>
//           <p><b>Category:</b> ${r.category || "-"} | <b>Difficulty:</b> ${r.difficulty || "-"}</p>
//           <img src="${r.imageUrl || "https://via.placeholder.com/150"}" width="200"/>
//         `;
//         container.appendChild(div);
//       });
//     }
//     loadRecipes();

//     // ✅ Add Recipe
//     document.getElementById("recipeForm").addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const title = document.getElementById("title").value;
//       const ingredients = document.getElementById("ingredients").value;
//       const instructions = document.getElementById("instructions").value;
//       const cookingTime = document.getElementById("cookingTime").value;
//       const servings = document.getElementById("servings").value;
//       const category = document.getElementById("category").value;
//       const difficulty = document.getElementById("difficulty").value;
//       const imageUrl = document.getElementById("imageUrl").value;

//       const res = await fetch("/recipes", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization":token
//         },
//         body: JSON.stringify({ title, ingredients, instructions, cookingTime, servings, category, difficulty, imageUrl })
//       });

//       if (res.ok) {
//         alert("Recipe added!");
//         document.getElementById("recipeForm").reset();
//         loadRecipes();
//       } else {
//         const err = await res.json();
//         alert("Error: " + err.message);
//       }
//     });















    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
const isAdmin=localStorage.getItem('isAdmin');
    if (!token) {
      window.location.href = "../login/login.html";
    } else {
      document.getElementById("username").innerText = username;
    }
    if(isAdmin=='true')
    {
      document.getElementById('adminBtn').style.display='inline-block';
      document.getElementById('adminBtn').addEventListener('click',()=>{
window.Location.href='../admin/admin.html'
      }
  )
    }

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "../login/login.html";
    });

    // ✅ Load Recipes
    async function loadRecipes() {
      const res = await fetch("/recipes");

      const recipes = await res.json();

      const container = document.getElementById("recipes");
      container.innerHTML = "";

      recipes.forEach(r => {
        const div = document.createElement("div");
        div.className = "recipe";
        div.innerHTML = `
          <h3>${r.title}</h3>
          <p><b>By:</b> ${r.User?.name || "Unknown"}</p>
          <p><b>Ingredients:</b> ${r.ingredients}</p>
          <p><b>Instructions:</b> ${r.instructions}</p>
          <p><b>Time:</b> ${r.cookingTime || "-"} mins | <b>Servings:</b> ${r.servings || "-"}</p>
          <p><b>Category:</b> ${r.category || "-"} | <b>Difficulty:</b> ${r.difficulty || "-"}</p>
          <img src="${r.imageUrl || "https://via.placeholder.com/150"}" width="200"/><br>
          <button onclick="addFavorite(${r.id})">⭐ Favorite</button>
          <button onclick="editRecipe(${r.id})">✏ Edit</button>
          <button onclick="deleteRecipe(${r.id})">🗑 Delete</button>
          <div>
  <label>Rating:</label>
  <select id="rating-${r.id}">
    <option value="1">⭐</option>
    <option value="2">⭐⭐</option>
    <option value="3">⭐⭐⭐</option>
    <option value="4">⭐⭐⭐⭐</option>
    <option value="5" selected>⭐⭐⭐⭐⭐</option>
  </select>
  <br>
  <textarea id="review-${r.id}" placeholder="Write a review"></textarea>
  <button onclick="addReview(${r.id})">💬 Add Review</button>
</div>
          <div id="reviews-${r.id}">
            <h5>Reviews:</h5>
          </div>
        `;
        container.appendChild(div);
        loadReviews(r.id);
      });
    }

    // ✅ Add Recipe
    document.getElementById("recipeForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        title: document.getElementById("title").value,
        ingredients: document.getElementById("ingredients").value,
        instructions: document.getElementById("instructions").value,
        cookingTime: document.getElementById("cookingTime").value,
        servings: document.getElementById("servings").value,
        category: document.getElementById("category").value,
        difficulty: document.getElementById("difficulty").value,
        imageUrl: document.getElementById("imageUrl").value,
      };

      const res = await fetch("/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization":`Bearer ${token}`},
        body: JSON.stringify(data)
      });

      if (res.ok) {
        alert("Recipe added!");
        document.getElementById("recipeForm").reset();
        loadRecipes();
      } else {
        const err = await res.json();
        alert("Error: " + err.message);
      }
    });

    // ⭐ Add Favorite
    async function addFavorite(recipeId) {
   
     const res= await fetch("/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization":`Bearer ${token}`},
        body: JSON.stringify({ recipeId })
      });
     
      const result=await res.json();
      if(res.ok)
      {
 alert("Added to favorites!");
      loadFavorites();
      }
       else {
    alert("Error: " + result.message);
  }
     
    }

    // 📌 Load Favorites
    async function loadFavorites() {
 
      const res = await fetch("/favorite", {
        headers: {"Authorization":`Bearer ${token}`}
      });
      const favorites = await res.json();
     
      const container = document.getElementById("favorites");
      container.innerHTML = "";
console.log(favorites)
      favorites.forEach(f => {
        const div = document.createElement("div");
        div.className = "recipe";
        div.innerHTML = `<h3>${f.Recipe.title}</h3><p>${f.Recipe.ingredients}</p>`;
        container.appendChild(div);
      });
    }

    // ✏ Edit Recipe
    async function editRecipe(id) {
      const newTitle = prompt("Enter new title:");
      if (!newTitle) return;
     const res= await fetch(`/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json","Authorization":`Bearer ${token}`},
        body: JSON.stringify({ title: newTitle })
      });
if(res.ok)
{
 alert("Recipe updated!");
      loadRecipes();
}
     else{
      console.log(res.result);
     }
    }

    // 🗑 Delete Recipe
    async function deleteRecipe(id) {
      if (!confirm("Delete this recipe?")) return;
      await fetch(`/recipes/${id}`, {
        method: "DELETE",
        headers: {"Authorization":`Bearer ${token}`}
      });
      alert("Recipe deleted!");
      loadRecipes();
    }

    // 💬 Add Review
    async function addReview(recipeId) {
      const text = document.getElementById(`review-${recipeId}`).value;
      const rating=document.getElementById(`rating-${recipeId}`).value;
      if (!text) return alert("Enter review text!");

      const res=await fetch('/review', {
        method: "POST",
        headers: { "Content-Type": "application/json","Authorization":`Bearer ${token}`},
        body: JSON.stringify({ recipeId, comment: text,rating })
      });
      const result=await res.json();
      if(res.ok)
      {
alert("Review added!");
      document.getElementById(`review-${recipeId}`).value='';
      loadReviews(recipeId);
      }
      else{
        console.log(result.message)
      }
    }

    // 📌 Load Reviews for a Recipe
    async function loadReviews(recipeId) {
    
      const res = await fetch(`/review/${recipeId}`,{
        method: "GET",
        headers: { "Content-Type": "application/json","Authorization":`Bearer ${token}`}});
      const reviews = await res.json();
      if(res.ok)
      {

      const container = document.getElementById(`reviews-${recipeId}`);
      container.innerHTML = "<h5>Reviews:</h5>";

      reviews.forEach(r => {
        const p = document.createElement("p");
        p.innerText = `${r.User?.name || "Anon"}(${r.rating}⭐): ${r.comment}`;
        container.appendChild(p);
      });
      }
      else{
        
        console.log(reviews.message)
      }
     
    }

    // ✅ Init
    loadRecipes();
    loadFavorites();
  