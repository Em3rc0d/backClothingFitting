const express = require("express");
const router = express.Router();
const clothesController = require("../controllers/clothes.controller");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/create", verifyToken, clothesController.createClothes);
router.get("/image/:id", verifyToken, clothesController.getClothesImage);
router.get("/category/:category", verifyToken, clothesController.getClothesByCategory);
router.post("/delete/:id", verifyToken, clothesController.deleteClothes);
router.post("/update/:id", verifyToken, clothesController.updateClothes);

module.exports = router;