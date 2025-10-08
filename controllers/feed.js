
const Recipe = require("../models/recipe");
const User = require("../models/user");
const Follow = require("../models/follow");
const Review = require("../models/review");


// ✅ Get activity feed (recipes + reviews of followed users)
exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.id;
console.log("Authenticated user ID:", userId);
console.log("req.user:", req.user);

    // get people I follow
    const follows = await Follow.findAll({ where: { followerId: userId } });
    const followingIds = follows.map(f => f.followingId);
console.log("Following IDs:", followingIds);

    if (followingIds.length === 0) {
      return res.json([]);
    }

    // get recipes + reviews from followed users
    const recipes = await Recipe.findAll({
      where: { UserId: followingIds },
      include: [{ model: User,as:'User', attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
      limit: 10
    });

    const reviews = await Review.findAll({
      where: { UserId: followingIds },
      include: [
        { model: User, attributes: ["id", "name"] },
        { model: Recipe, attributes: ["id", "title"] }
      ],
      order: [["createdAt", "DESC"]],
      limit: 10
    });
console.log(reviews)
    const feed = [
      ...recipes.map(r => ({
        type: "recipe",
        user: r.User?.name||"unknown user",
        recipe: r.title,
        createdAt: r.createdAt
      })),
      ...reviews.map(rv => ({
        type: "review",
        user: rv.User?.name||'unknown user',
        recipe: rv.Recipe?.title||'Deleted Recipe',
        comment: rv.comment,
        createdAt: rv.createdAt
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
console.log('feed.......',feed);
    res.json(feed);
  } catch (err) {
    console.error("Feed error:", err);
    res.status(500).json({ message: "Failed to fetch feed" });
  }
};