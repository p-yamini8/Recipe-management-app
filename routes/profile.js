const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile");
const auth = require("../middleware/auth");

router.get("/", auth.authenticate, profileController.getProfile);
router.post("/follow", auth.authenticate, profileController.followUser);
router.post("/unfollow", auth.authenticate, profileController.unfollowUser);
router.get("/followers", auth.authenticate, profileController.getFollowers);
router.get("/following", auth.authenticate, profileController.getFollowing);
router.put("/update", auth.authenticate, profileController.profileUpdate);
module.exports = router;