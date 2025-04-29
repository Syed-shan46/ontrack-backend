const express = require("express");
const { createUser, getUserByUid, updateUser, deleteUser, followUser, unfollowUser, loginUser, changeUserDetails, verifyUserOTP, checkusername, sendSms, searchUser, checkIsFollowing } = require("../controllers/user_controller");
const { verifyOTP } = require("../controllers/otp_controller");

const router = express.Router();

router.post("/create", createUser);                      // register user
router.post("/verify-otp", verifyUserOTP);               // Verify OTP
router.get("/user-by-id/:uid", getUserByUid);                       // Get user by UID
router.put("/changeData/:id", changeUserDetails);        // Change all user details
router.put("/update/:id", updateUser);                   // Update user details
router.delete("/:uid", deleteUser);                      // Delete user
router.post("/follow", followUser);                      // Follow a user  
router.post('/isfollowing',checkIsFollowing),  
router.post("/unfollow", unfollowUser);                  // Unfollow a user
router.post("/login", loginUser);                        // Login user
router.get("/check-username/:username'", checkusername); // Check if username is available
router.post("/send-otp", sendSms);                       // Send OTP to user
router.post("/verify-otp", verifyOTP);                   // Verify OTP
router.get("/search", searchUser);                       // Search users


module.exports = router;
