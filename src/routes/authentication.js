const express = require("express");
const { getOTP, verifyOTP } = require("../controllers/authentication");
const router = express.Router();

router.post("/auth/get-otp", getOTP);
router.post("/auth/verify-otp", verifyOTP);

module.exports = router;
