const Review = require("../models/review");
const User = require("../models/user");

exports.addReview = async (req, res) => {
  try {
    const { recipeId, comment } = req.body;
    const review = await Review.create({ comment, UserId: req.user.id, RecipeId: recipeId });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const reviews = await Review.findAll({
      where: { RecipeId: recipeId },
      include: [{ model: User, attributes: ["id", "name"] }]
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};