const express = require('express');
const { sendOTP, verifyOTP } = require('../controllers/authentication');
const router = express.Router();

router.route('/send-otp').post(sendOTP);
router.route('/verify-otp').post(verifyOTP);

module.exports = router;