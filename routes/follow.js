

const express = require("express");
const followController = require("../controllers/follow");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

// ✅ Now matches frontend calls: POST /follow/:userId and DELETE /follow/:userId
router.post("/:userId", authenticate, followController.followUser);
router.delete("/:userId", authenticate, followController.unfollowUser);

// Optional: keep followers/following list
router.get("/:userId/followers", authenticate, followController.getFollowers);
router.get("/:userId/following", authenticate, followController.getFollowing);

module.exports = router;
