const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/authMiddleware");
const userControllers = require("../controllers/userControllers");

// Define routes User route
router.post("/register", userControllers.register);
router.post("/login", userControllers.login);
router.get("/users", authenticate, userControllers.getAllUser);
router.get("/status", userControllers.status);

module.exports = router;
