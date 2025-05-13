const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/auth");

// ─── Login Route ──────────────────────────────────────────────────────────────
// Expects: { username, password }
// Returns: JWT access token (typically in an HTTP-only cookie or in response)
router.post("/login", login);

// ─── Logout Route ─────────────────────────────────────────────────────────────
// Clears token or session info to log the user out
router.post("/logout", logout);

module.exports = router;
