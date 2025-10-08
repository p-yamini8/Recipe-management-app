const User = require("../models/user");
const Recipe = require("../models/recipe");

// ✅ Get all users
exports.getUsers = async (req, res) => {
  const users = await User.findAll({ attributes: ["id", "name", "email", "isAdmin"] });
  res.json(users);
};

// ✅ Ban a user
exports.banUser = async (req, res) => {
  await User.update({ banned: true }, { where: { id: req.params.id } });
  res.json({ message: "User banned" });
};

// ✅ Approve a user (remove ban)
exports.approveUser = async (req, res) => {
  await User.update({ banned: false }, { where: { id: req.params.id } });
  res.json({ message: "User approved" });
};

// ✅ Remove a recipe
exports.deleteRecipe = async (req, res) => {
  await Recipe.destroy({ where: { id: req.params.id } });
  res.json({ message: "Recipe deleted by admin" });
};