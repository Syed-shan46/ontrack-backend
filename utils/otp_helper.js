const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

// Generate a random 6-digit OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Send OTP via email
const sendOTP = async (email, otp) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email Verification OTP",
        text: `Your OTP for registration is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
};

const sendOtpForPasswordResetPassword = async (email, otp) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { generateOTP, sendOTP ,sendOtpForPasswordResetPassword};
