const express = require("express");
const { verifyUser, approveUser, denyUser } = require("../controllers/authController");
const router = express.Router();

// Verify user token
router.post("/verify", verifyUser);

// Approve or deny user (admin only)
router.post("/approve", approveUser);
router.post("/deny", denyUser);

module.exports = router;
