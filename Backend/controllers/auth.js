// controllers/auth.js
const User = require("../models/admin/userSchema");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Direct password comparison (no bcrypt)
    if (password !== user.password) {
      return res.status(401).json({ message: "Password not correct" });
    }

    // Get user permissions by populating roles and their permissions
    const userWithRoles = await User.findById(user._id)
      .populate({
        path: 'roles',
        populate: { path: 'permissions' }
      });
      
    // Extract unique permission objects from roles
    const uniquePermissionMap = new Map();
    if (userWithRoles.roles && userWithRoles.roles.length > 0) {
      userWithRoles.roles.forEach(role => {
        if (role.permissions && role.permissions.length > 0) {
          role.permissions.forEach(perm => {
            if (perm && perm._id && !uniquePermissionMap.has(perm._id.toString())) {
              uniquePermissionMap.set(perm._id.toString(), {
                _id: perm._id,
                name: perm.name,
                description: perm.description
              });
            }
          });
        }
      });
    }
    
    // Convert Map to Array of permission objects
    const permissions = Array.from(uniquePermissionMap.values());
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return response in the format expected by frontend
    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        isAdmin: userWithRoles.roles.some(role => role.name === 'Administrator'),
        token
      },
      permissions: permissions
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    // 1. Clear the access-token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    // 2. Send response
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error during logout" });
  }
};

module.exports = { login, logout };
