const express = require("express");
const router = express.Router();
const { auth, admin } = require("../middleware/auth");
const userController = require("../controllers/userController");
const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const adminController = require("../controllers/adminController");

// Admin Dashboard
router.get("/dashboard", auth, admin, adminController.getDashboard);

// Admin User Management
router.get("/users", auth, admin, adminController.getUsers);
router.post("/users", auth, admin, adminController.createUser);
router.get("/users/:id", auth, admin, userController.getUserById);
router.put("/users/:id", auth, admin, userController.updateUser);
router.delete("/users/:id", auth, admin, userController.deleteUser);
router.put("/users/:id/activate", auth, admin, adminController.activateUser);
router.put("/users/:id/deactivate", auth, admin, adminController.deactivateUser);
router.put("/users/:id/role", auth, admin, adminController.updateUserRole);

// Admin Post Management
router.get("/posts", auth, admin, postController.getAllPosts);
router.get("/posts/:id", auth, admin, postController.getPostById);
router.delete("/posts/:id", auth, admin, postController.deletePost);
router.put("/posts/:id/status", auth, admin, adminController.updatePostStatus);
router.put("/posts/:id/feature", auth, admin, adminController.updatePostFeature);

// Admin Comment Management
router.get("/comments", auth, admin, adminController.getComments);
router.delete("/comments/:id", auth, admin, adminController.deleteComment);
router.put("/comments/:id", auth, admin, adminController.updateCommentStatus);

// Analytics endpoints
router.get("/analytics", auth, admin, adminController.getAnalytics);

module.exports = router;
