require("dotenv").config();
const axios = require("axios");

const sendUserToOTP = async (mobileNumber, otp) => {
    try {
        const response = await axios.get(`https://control.msg91.com/api/v5/otp?template_id=${process.env.MSG91_TEMPLATE_ID}&authkey=${process.env.MSG91_AUTH_KEY}&mobile=${mobileNumber}&otp=${otp}`);
        return response.data;
    } catch (error) {
        console.error("Error sending OTP:", error);
        return { success: false, message: "Failed to send OTP" };
    }   
};

const verifyOTP = async (mobileNumber, otp) => {
    try {
        const response = await axios.get(`https://control.msg91.com/api/v5/otp/verify?authkey=${process.env.MSG91_AUTH_KEY}&mobile=${mobileNumber}&otp=${otp}`);
        return response.data;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, message: "Failed to verify OTP" };
    }
};

module.exports = { sendUserToOTP, verifyOTP };

