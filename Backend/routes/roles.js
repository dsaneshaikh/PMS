const express = require("express");
const router = express.Router();

const { createRole, getAllRoles, deleteRole, updateRolePermissions } = require("../controllers/roles");

const { auth, permit } = require("../middleware/auth");

// Create a new role (admin only)
router.post("/", auth, permit("manage_roles"), createRole);

// List all roles with their permissions (any authenticated user)
router.get("/", auth, getAllRoles);

// Delete a role by ID (admin only)
router.delete("/:id", auth, permit("manage_roles"), deleteRole);

// Update role permissions (admin only)
router.put("/:id/permissions", auth, permit("manage_roles"), updateRolePermissions);

module.exports = router;
