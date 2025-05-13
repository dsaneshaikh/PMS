const Role = require("../models/admin/roleSchema");
const Permission = require("../models/admin/permssionSchema");

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    if (!name || !Array.isArray(permissions)) {
      return res
        .status(400)
        .json({ message: "Role name and permissions[] are required" });
    }

    const existing = await Role.findOne({ name });
    if (existing)
      return res.status(409).json({ message: "Role already exists" });

    const foundPermissions = await Permission.find({
      _id: { $in: permissions },
    });
    if (foundPermissions.length !== permissions.length) {
      return res.status(400).json({ message: "Some permissions are invalid" });
    }

    const role = new Role({
      name,
      permissions,
    });

    await role.save();
    res.status(201).json({ message: "Role created", role });
  } catch (err) {
    console.error("createRole error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all roles with permissions
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions", "name");
    res.json(roles);
  } catch (err) {
    console.error("getAllRoles error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Role.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Role not found" });

    res.json({ message: "Role deleted" });
  } catch (err) {
    console.error("deleteRole error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update role permissions
exports.updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;
    
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "permissions[] is required and must be an array" });
    }

    // Verify all permissions exist
    const foundPermissions = await Permission.find({
      _id: { $in: permissions },
    });
    
    if (foundPermissions.length !== permissions.length) {
      return res.status(400).json({ message: "Some permissions are invalid" });
    }

    // Find and update the role
    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { permissions },
      { new: true }
    ).populate("permissions", "name");

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({ 
      message: "Role permissions updated successfully", 
      role: updatedRole 
    });
  } catch (err) {
    console.error("updateRolePermissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
