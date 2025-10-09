// controllers/recipes.controller.js
const Recipe = require("../models/recipe");
const User = require("../models/user");
const { Op } = require("sequelize");

// ✅ Create Recipe
exports.createRecipe = async (req, res) => {
  try {
    const { title, ingredients, instructions, cookingTime, servings, category, difficulty, imageUrl } = req.body;

    if (!title || !ingredients || !instructions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const recipe = await Recipe.create({
      title,
      ingredients,
      instructions,
      cookingTime,
      servings,
      category,
      difficulty,
      imageUrl,
      userId:req.user.id
    });
// When creating a recipe or review
if (req.user.banned) {
  return res.status(403).json({ message: "Banned users cannot post content." });
}

    res.status(201).json({ message: "Recipe created successfully", recipe });
  } catch (err) {
    console.error("Create recipe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Recipes (with search & filters)
exports.getRecipes = async (req, res) => {
  try {
    const { search, category, difficulty } = req.query;

    let whereClause = {};
    if (search) {
      whereClause.title = { [Op.like]:`%${search}%` };
    }
    if (category) {
      whereClause.category = category;
    }
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

   const recipes = await Recipe.findAll({
    where:whereClause,
  include: [
    { model: User, attributes: ["id", "name"], as: "User", where: { banned: false }  }
  ],
  order: [["createdAt", "DESC"]]
});
    res.json(recipes);
  } catch (err) {
    console.error("Get recipes error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Single Recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "name", "email"] }]
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(recipe);
  } catch (err) {
    console.error("Get recipe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Recipe (only owner can edit)
exports.updateRecipe = async (req, res) => {
  try {
    const {id}=req.params;
    const {title}=req.body;
    const recipe = await Recipe.findByPk(id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

   

    await recipe.update({title:title||recipe.title});
    // await recipe.save();
    res.json({ message: "Recipe updated successfully", recipe });
  } catch (err) {
    console.error("Update recipe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Delete Recipe (only owner can delete)
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    await recipe.destroy();
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    console.error("Delete recipe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};