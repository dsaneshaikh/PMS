const jwt = require("jsonwebtoken");
const User = require("../models/admin/userSchema");
const Role = require("../models/admin/roleSchema");

exports.auth = async (req, res, next) => {
  try {
    // 1. Read the token 
    const token =
      req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Authentication required" });

    // 2. Verify it
    const payload = jwt.verify(token, process.env.JWT_SECRET); // Changed to match auth controller

    // 3. Lookup the user and attach to req
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.userId = user._id;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

exports.permit = (permissionName) => async (req, res, next) => {
  try {
    // 1. Load the user’s roles & permissions
    const user = await User.findById(req.userId).populate({
      path: "roles",
      populate: { path: "permissions", select: "name" },
    });

    // Special case: Check if any of the user's roles is named 'Administrator'
    // If so, automatically grant all permissions
    const isAdmin = user.roles.some(role => role.name === 'Administrator');
    if (isAdmin) {
      console.log('Administrator bypassing permission check for', permissionName);
      return next(); // Skip permission check for admin users
    }

    // 2. Flatten all permission names
    const perms = new Set();
    user.roles.forEach((role) =>
      role.permissions.forEach((p) => perms.add(p.name))
    );

    // 3. Check for the requested permission
    if (!perms.has(permissionName)) {
      return res
        .status(403)
        .json({ message: `Forbidden: insufficient rights (${permissionName} required)` });
    }

    next();
  } catch (err) {
    console.error("Permit error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
