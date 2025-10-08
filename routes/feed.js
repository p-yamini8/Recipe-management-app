const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed");
const auth = require("../middleware/auth");

router.get("/", auth.authenticate, feedController.getFeed);

module.exports = router;