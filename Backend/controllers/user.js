// controllers/userController.js

const User = require("../models/admin/userSchema");
const Role = require("../models/admin/roleSchema");

// Create a new user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { username, password, roles } = req.body;
    if (!username || !password || !Array.isArray(roles)) {
      return res
        .status(400)
        .json({ message: "username, password, and roles[] are required" });
    }

    // Store password directly without hashing

    // 2. Validate roles
    const foundRoles = await Role.find({ _id: { $in: roles } });
    if (foundRoles.length !== roles.length) {
      return res.status(400).json({ message: "One or more roles are invalid" });
    }

    // 3. Create user
    const user = new User({
      username,
      password, // Store the plain password
      roles,
    });
    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        username: user.username,
        roles: foundRoles.map((r) => r.name),
      },
    });
  } catch (err) {
    console.error("createUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current logged-in user
exports.getMe = async (req, res) => {
  try {
    // req.userId set by auth middleware
    const user = await User.findById(req.userId)
      .select("-password")
      .populate({
        path: "roles",
        populate: { path: "permissions" },
      });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("roles", "name");
    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user roles (admin only)
exports.updateUserRoles = async (req, res) => {
  try {
    const { username, roles } = req.body;
    if (!username || !Array.isArray(roles)) {
      return res
        .status(400)
        .json({ message: "username and roles[] are required" });
    }

    // Validate roles
    const foundRoles = await Role.find({ _id: { $in: roles } });
    if (foundRoles.length !== roles.length) {
      return res.status(400).json({ message: "One or more roles are invalid" });
    }

    // Update
    const updated = await User.findOneAndUpdate(
      { username },
      { roles },
      { new: true }
    )
      .select("-password")
      .populate("roles", "name");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "User roles updated",
      user: updated,
    });
  } catch (err) {
    console.error("updateUserRoles error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user password (admin or self)
exports.updatePassword = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and new password are required" });
    }

    // Update with plain password
    const updated = await User.findOneAndUpdate(
      { username },
      { password },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("updatePassword error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    // Get username directly from URL params now
    const { username } = req.params;
    
    console.log('DELETE USER - username from params:', username);
    
    if (!username) {
      return res.status(400).json({ message: "Username is required as URL parameter" });
    }
    
    console.log(`Attempting to delete user with username: ${username}`);
    
    const removed = await User.findOneAndDelete({ username });
    if (!removed) {
      console.log(`User not found: ${username}`);
      return res.status(404).json({ message: `User '${username}' not found` });
    }
    
    console.log(`User deleted successfully: ${username}`);
    res.json({ message: `User '${username}' deleted successfully` });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
