const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");
const auth = require("../middleware/auth");

// Middleware to check admin
function checkAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
}

router.get("/users", auth.authenticate, checkAdmin, adminController.getUsers);
router.get('/recipes',auth.authenticate,checkAdmin,adminController.getRecipes);
router.put("/ban/:id", auth.authenticate, checkAdmin, adminController.banUser);
router.put("/approve/:id", auth.authenticate, checkAdmin, adminController.approveUser);
router.delete("/recipe/:id", auth.authenticate, checkAdmin, adminController.deleteRecipe);

module.exports = router;