const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, categoryController.getAllCategories);
router.get("/:id", verifyToken, categoryController.getCategoryById);
router.post("/create", verifyToken, categoryController.createCategory);
router.put("/update/:id", verifyToken, categoryController.updateCategory);
router.delete("/delete/:id", verifyToken, categoryController.deleteCategory);

module.exports = router;
