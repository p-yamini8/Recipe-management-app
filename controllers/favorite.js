// const Favorite = require("../models/favorite");
// const Recipe = require("../models/recipe");

// exports.addFavorite = async (req, res) => {
//   try {
   
//     const { recipeId } = req.body;
//     console.log('recipe id',recipeId)
//     const fav = await Favorite.create({ UserId: req.user.id, RecipeId: recipeId });
//     res.status(201).json(fav);
//   } catch (err) {
//     res.status(500).json({ message: "Error adding favorite", error: err.message });
//   }
// };

// exports.getFavorites = async (req, res) => {
//   try {
//     const favorites = await Favorite.findAll({
//       where: { UserId: req.user.id },
//       include: [Recipe]
//     });
//     res.json(favorites);
// console.log(favorites)
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching favorites", error: err.message });
//   }
// };


const Favorite = require("../models/favorite");
const Recipe = require("../models/recipe");

exports.addFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;
    console.log("Add to favorite: recipeId =", recipeId, "userId =", req.user.id);

    // Prevent duplicate favorites
    const existing = await Favorite.findOne({
      where: { UserId: req.user.id, RecipeId: recipeId }
    });

    if (existing) {
      return res.status(400).json({ message: "Recipe already in favorites." });
    }

    const favorite = await Favorite.create({
      UserId: req.user.id,
      RecipeId: recipeId
    });

    res.status(201).json(favorite);
  } catch (err) {
    console.error("Error in addFavorite:", err);
    res.status(500).json({ message: "Error adding favorite", error: err.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Recipe }]
    });

    console.log("User Favorites:", favorites);
    res.json(favorites);
  } catch (err) {
    console.error("Error in getFavorites:", err);
    res.status(500).json({ message: "Error fetching favorites", error: err.message });
  }
};
