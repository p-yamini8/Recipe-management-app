const Review = require("../models/review");
const User = require("../models/user");

exports.addReview = async (req, res) => {
  try {
    const { recipeId, comment,rating } = req.body;
    if(!recipeId||!comment)
    {
      return res.status(400).json({message:"RecipeId and comment required"})
    }
    const review = await Review.create({ comment, userId: req.user.id,recipeId,rating:rating ?parseInt(rating):5});
     // Fetch with user details so frontend can display name directly
    const reviewWithUser = await Review.findOne({
      where: { id: review.id },
      include: [{ model: User, attributes: ["id", "name"] }]
    });

    res.status(201).json(reviewWithUser);
  } catch (err) {
    console.error("Error adding review:", err);
    res.status(500).json({ message: "Error adding review", error: err.message });
  }
};


exports.getReviews = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const reviews = await Review.findAll({
      where: { recipeId }, // ✅ lowercase to match DB field
      include: [{ model: User, attributes: ["id", "name"] }]
    });

    console.log("Fetched reviews:", reviews); // ✅ Debug output

    res.json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err); // ✅ log server errors
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};
