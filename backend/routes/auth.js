const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { auth } = require("../middleware/auth");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/oauth/google", authController.googleAuth);
router.post("/oauth/facebook", authController.facebookAuth);

// Email verification routes
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/resend-verification", auth, authController.resendVerification);

// Password reset routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:resetToken", authController.resetPassword);
router.get("/verify-reset-token/:resetToken", authController.verifyResetToken);

// Protected routes
router.get("/profile", auth, authController.getProfile);
router.put("/profile", auth, authController.updateProfile);

module.exports = router;
