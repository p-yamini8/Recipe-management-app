
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
const isAdmin=localStorage.getItem('isAdmin');
console.log('isAdmin',isAdmin)
alert(isAdmin)
    if (!token) {
      window.location.href = "../login/login.html";
    } else {
      document.getElementById("nav-username").innerText = username;
       document.getElementById("welcome-username").innerText = username;
    }
    if(isAdmin==='true')
    {alert('admin')
      document.getElementById('adminBtn').style.display='block';
      document.getElementById('adminBtn').addEventListener('click',()=>{
window.location.href='../admin/admin.html'
      }
  )
    }

   

    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "../login/login.html";
    });

async function loadRecipes(filters = {}) {
  // Clean up empty filters
  Object.keys(filters).forEach(key => {
    if (!filters[key]) delete filters[key];
  });

  const query = new URLSearchParams(filters).toString();
  const url = query ? `/recipes?${query}` : `/recipes`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  const recipes = await res.json();
  const container = document.getElementById("recipes");
  container.innerHTML = "";
console.log('recipes',recipes)
  if (Array.isArray(recipes)) {
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
        <img src="${r.imageUrl}" alt="Recipe Image" style="max-width: 100%; height: auto;" />

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
  } else {
    container.innerHTML = "<p>No recipes found.</p>";
  }
}

    // ✅ Add Recipe
    document.getElementById("recipeForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById("imageUrl");
  const file = fileInput.files?.[0];

  if (!file) {
    alert("Please select an image file.");
    return;
  }

  let imageUrl;
 try {
  imageUrl = await uploadImageToS3(file);
} catch (err) {
  console.error("Image upload failed:", err);
  alert("Image upload failed: " + err.message);
}

      const data = {
        title: document.getElementById("title").value,
        ingredients: document.getElementById("ingredients").value,
        instructions: document.getElementById("instructions").value,
        cookingTime: document.getElementById("cookingTime").value,
        servings: document.getElementById("servings").value,
        category: document.getElementById("category").value,
        difficulty: document.getElementById("difficulty").value,
        imageUrl: imageUrl
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
  // 🔍 Handle Search Form Submission
document.getElementById("searchForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const filters = {
    search: document.getElementById("searchTitle").value.trim(),
    category: document.getElementById("searchCategory").value.trim(),
    difficulty: document.getElementById("searchDifficulty").value
  };
  loadRecipes(filters);
});

// ❌ Clear Search
document.getElementById("clearSearch").addEventListener("click", function () {
  document.getElementById("searchForm").reset();
  loadRecipes(); // Reload all
});


async function uploadImageToS3(file) {
  try {
    // 1. Get signed URL from backend
    const res = await fetch(`/upload/get-upload-url?fileType=${file.type}`);
    if (!res.ok) throw new Error("Failed to get signed URL");

    const { uploadURL, imageUrl } = await res.json();

    // 2. Upload file to S3
    const uploadRes = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type // MUST match backend ContentType
        // ✅ Do NOT add x-amz-acl unless your signed URL includes it
      }
    });

    if (!uploadRes.ok) throw new Error("S3 upload failed: " + uploadRes.status);

    // 3. Return final public URL
    return imageUrl;

  } catch (err) {
    console.error("Upload Error:", err);
    throw err; // so your try/catch in submit will catch it
  }
}