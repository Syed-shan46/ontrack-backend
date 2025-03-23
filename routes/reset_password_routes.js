const express = require("express");
const { requestOTP, verifyOTP, updatePassword } = require("../controllers/resetPasswordController");
const router = express.Router();

router.post("/request-otp",requestOTP);         // Request OTP for Password Reset

router.post("/verify-otp",verifyOTP);           // Verify OTP

router.post("/update-password",updatePassword); // Update Password

module.exports = router;