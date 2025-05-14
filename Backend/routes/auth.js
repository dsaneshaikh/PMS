const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/auth");

// ─── Login Route ──────────────────────────────────────────────────────────────

router.post("/login", login);

// ─── Logout Route ─────────────────────────────────────────────────────────────

router.post("/logout", logout);

module.exports = router;
