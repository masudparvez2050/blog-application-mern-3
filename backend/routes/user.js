const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { auth, admin } = require("../middleware/auth");

// All routes are protected and require admin privileges
router.get("/", auth, admin, getAllUsers);
router.get("/:id", auth, admin, getUserById);
router.put("/:id", auth, admin, updateUser);
router.delete("/:id", auth, admin, deleteUser);

module.exports = router;
