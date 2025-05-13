// routes/users.js

const express = require("express");
const router = express.Router();

const {
  createUser,
  getMe,
  getAllUsers,
  updateUserRoles,
  updatePassword,
  deleteUser,
} = require("../controllers/user");

const { auth, permit } = require("../middleware/auth");

// ─── Create a new user (admin only) ──────────────────────────────────────────
router.post("/createUser", auth, permit("manage_users"), createUser);

// ─── Get current logged-in user ─────────────────────────────────────────────
router.get("/me", auth, getMe);

// ─── Get all users (admin only) ──────────────────────────────────────────────
router.get("/", auth, permit("manage_users"), getAllUsers);

// ─── Update user roles (admin only) ─────────────────────────────────────────
router.put("/roles", auth, permit("manage_users"), updateUserRoles);

// ─── Update a user’s password (self or admin) ───────────────────────────────
router.put("/password", auth, updatePassword);

// ─── Delete a user (admin only) ──────────────────────────────────────────────
// Changed to use URL parameter instead of body
router.delete("/:username", auth, permit("manage_users"), deleteUser);

module.exports = router;
