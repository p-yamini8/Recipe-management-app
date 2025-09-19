const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review");
const auth = require("../middleware/auth"); // middleware to check JWT

// Add a review
router.post("/", auth.authenticate, reviewController.addReview);

// Get reviews for a recipe
router.get("/:recipeId",auth.authenticate,reviewController.getReviews);

module.exports = router;