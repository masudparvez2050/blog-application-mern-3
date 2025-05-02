const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  upload,
} = require("../controllers/userController");
const { auth, admin } = require("../middleware/auth");

// Profile routes - these need to come BEFORE the /:id routes to prevent "profile" being treated as an ID
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.post(
  "/upload-profile-picture",
  auth,
  upload.single("image"),
  uploadProfilePicture
);

// Admin routes
router.get("/", auth, admin, getAllUsers);
router.get("/:id", auth, admin, getUserById);
router.put("/:id", auth, admin, updateUser);
router.delete("/:id", auth, admin, deleteUser);

module.exports = router;
