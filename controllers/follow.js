const Follow = require("../models/follow");
const User = require("../models/user");
const sequelize = require("../util/database");

// ✅ Follow a user
exports.followUser = async (req, res) => {
  try {
   const t = await sequelize.transaction();  
    const followerId = req.user.id;   // logged in user
    const { userId } = req.params;    // person I want to follow

    if (parseInt(userId) === followerId) {
      await t.rollback();
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if already following
    const exists = await Follow.findOne({ where: { followerId, followingId: userId },transaction:t});
    if (exists) {
      await t.rollback();
      return res.status(400).json({ message: "Already following this user" });
    }

    await Follow.create({ followerId, followingId: userId },{transaction:t});
    await t.commit();
    res.json({ message: "Followed successfully" });
  } catch (err) {
    await t.rollback();
    console.error("Follow error:", err);
    res.status(500).json({ message: "Failed to follow user" });
  }
};

// ✅ Unfollow a user
exports.unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId } = req.params;

    const follow = await Follow.findOne({ where: { followerId, followingId: userId } });
    if (!follow) {
      return res.status(404).json({ message: "You are not following this user" });
    }

    await follow.destroy();
    res.json({ message: "Unfollowed successfully" });
  } catch (err) {
    console.error("Unfollow error:", err);
    res.status(500).json({ message: "Failed to unfollow user" });
  }
};

// ✅ Get my followers
exports.getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followers = await Follow.findAll({
      where: { followingId: userId },
      include: [{ model: User, as: "FollowerUser", attributes: ["id", "name", "email"] }]
    });

    res.json(followers.map(f => f.FollowerUser));
  } catch (err) {
    console.error("Get followers error:", err);
    res.status(500).json({ message: "Failed to fetch followers" });
  }
};

// ✅ Get users I follow
exports.getFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const following = await Follow.findAll({
      where: { followerId: userId },
      include: [{ model: User, as: "FollowingUser", attributes: ["id", "name", "email"] }]
    });

    res.json(following.map(f => f.FollowingUser));
  } catch (err) {
    console.error("Get following error:", err);
    res.status(500).json({ message: "Failed to fetch following" });
  }
};