const User = require("../models/user");
const Recipe = require("../models/recipe");
const Favorite = require("../models/favorite");
const Follow = require("../models/follow");

// ✅ Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "createdAt"],
      include: [
        { model: Recipe, as: "Recipes" },
        { model: Favorite, include: [{ model: Recipe,as:"Recipe" }] },
        {model:User, as:"Followers", attributes:['id','name']},
        {model:User,as:"Following",attributes:['id','name']}
      ]
    });
    if(!user)
    {
        return res.status(404).json({message:'User not found'})
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// ✅ Follow a user
exports.followUser = async (req, res) => {
  try {
    const { userId } = req.body; // id of the user to follow
    if (userId === req.user.id) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }
    await Follow.create({ followerId: req.user.id, followingId: userId });
    res.json({ message: "Now following user" });
  } catch (err) {
    res.status(500).json({ message: "Error following user", error: err.message });
  }
};

// ✅ Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const { userId } = req.body;
    await Follow.destroy({ where: { followerId: req.user.id, followingId: userId } });
    res.json({ message: "Unfollowed user" });
  } catch (err) {
    res.status(500).json({ message: "Error unfollowing user", error: err.message });
  }
};

// ✅ Get followers & following
exports.getFollowers = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [{ model: User, as: "Followers" }]
  });
  res.json(user.Followers);
};

exports.getFollowing = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    include: [{ model: User, as: "Following" }]
  });
  res.json(user.Following);
};