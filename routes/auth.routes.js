const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.put("/update", authController.updateUser);
router.delete("/delete", authController.deleteUser);

module.exports = router;
