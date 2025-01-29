const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, userController.getAllUsers);
router.get("/me", verifyToken, userController.getCurrentUser);
router.get("/:id/clothes", verifyToken, userController.getClothesByUser);
router.get("/:id/outfits", verifyToken, userController.getOutfitsByUser);

module.exports = router;