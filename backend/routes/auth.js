const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  googleAuth,
  facebookAuth,
} = require("../controllers/authController");
const { auth } = require("../middleware/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/oauth/google", googleAuth);
router.post("/oauth/facebook", facebookAuth);

// Protected routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);

module.exports = router;
