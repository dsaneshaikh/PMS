const express = require("express");
const router = express.Router();

const {
  createPermission,
  getAllPermissions,
  deletePermission,
} = require("../controllers/permission");

const { auth, permit } = require("../middleware/auth");

// Create a new permission (admin only)
router.post("/", auth, permit("manage_permissions"), createPermission);

// List all permissions (any authenticated user)
router.get("/", auth, getAllPermissions);

// Delete a permission by ID (admin only)
router.delete("/:id", auth, permit("manage_permissions"), deletePermission);

module.exports = router;
