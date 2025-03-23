require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user_schema"); // Ensure correct path
const { generateOTP, sendOtpForPasswordReset, sendOtpForPasswordResetPassword } = require("../utils/otp_helper");

// Temporary OTP storage (Use Redis for better scalability)
const otpStorage = new Map();

// ✅ 1. Request OTP for Password Reset
const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        // Check if the user exists
        const user = await User.findOne({ email }); 
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const otp = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 mins

        // Store OTP in memory
        otpStorage.set(email, { otp, expiresAt });

        // Send OTP via email
        sendOtpForPasswordResetPassword(email, otp);

        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ 2. Verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP are required" });

        const storedOTP = otpStorage.get(email);
        if (!storedOTP) return res.status(400).json({ success: false, message: "OTP not found or expired" });

        if (storedOTP.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });

        if (Date.now() > storedOTP.expiresAt) {
            otpStorage.delete(email);
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        res.json({ success: true, message: "OTP verified" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ 3. Reset Password
const updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword )
            return res.status(400).json({ success: false, message: "Email, and new password are required" });


        // Hash new password and update user
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email }, { password: hashedPassword });

    

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { requestOTP, verifyOTP, updatePassword };
