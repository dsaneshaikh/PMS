const Permission = require("../models/admin/permssionSchema");

// Create a new permission
exports.createPermission = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Permission name is required" });

    const existing = await Permission.findOne({ name });
    if (existing)
      return res.status(409).json({ message: "Permission already exists" });

    const permission = new Permission({ name });
    await permission.save();

    res.status(201).json({ message: "Permission created", permission });
  } catch (err) {
    console.error("createPermission error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.json(permissions);
  } catch (err) {
    console.error("getAllPermissions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete permission
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Attempting to delete permission with ID: ${id}`);
    console.log('Request params:', req.params);
    
    // Check if ID is valid MongoDB ObjectId
    if (!id || id.length !== 24) {
      console.error(`Invalid permission ID format: ${id}`);
      return res.status(400).json({ message: "Invalid permission ID format" });
    }
    
    const deleted = await Permission.findByIdAndDelete(id);
    
    if (!deleted) {
      console.error(`Permission not found with ID: ${id}`);
      return res.status(404).json({ message: "Permission not found" });
    }

    console.log(`Permission deleted successfully: ${id}`);
    res.json({ message: "Permission deleted", id });
  } catch (err) {
    console.error("deletePermission error:", err);
    // Send more detailed error information including the original error message
    res.status(500).json({ 
      message: "Server error", 
      error: err.message,
      id: req.params.id 
    });
  }
};
