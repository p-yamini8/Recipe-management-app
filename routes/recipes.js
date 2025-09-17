// routes/recipes.routes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipes");
const authMiddleware = require("../middleware/auth");

// Public
router.get("/", recipeController.getRecipes);
router.get("/:id", recipeController.getRecipeById);


// // Protected
router.post("/", authMiddleware.authenticate, recipeController.createRecipe);
router.put("/:id", authMiddleware.authenticate, recipeController.updateRecipe);
router.delete("/:id", authMiddleware.authenticate, recipeController.deleteRecipe);

module.exports = router;