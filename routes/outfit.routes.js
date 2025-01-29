const express = require("express");
const router = express.Router();
const outfitController = require("../controllers/outfit.controller");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, outfitController.getOutfits);
router.get("/last", verifyToken, outfitController.getLastOutfit);
router.post("/create", verifyToken, outfitController.createOutfit);
router.get("/:id", verifyToken, outfitController.getOutfitById);
router.put("/:id", verifyToken, outfitController.updateOutfit);
router.delete("/:id", verifyToken, outfitController.deleteOutfit);
router.post("/clothes/:id", verifyToken, outfitController.addClothesToOutfit);
router.delete("/clothes/:id", verifyToken, outfitController.removeClothesFromOutfit);

module.exports = router;
