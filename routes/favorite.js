// routes/recipes.routes.js
const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favorite");
const authMiddleware = require("../middleware/auth");

// Public
router.get("/", authMiddleware.authenticate,favoriteController.getFavorites);


router.delete('/:id',authMiddleware.authenticate,favoriteController.removeFavorite);
// // Protected
router.post("/", authMiddleware.authenticate, favoriteController.addFavorite);

module.exports = router;