const User = require("../models/user_schema");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTP, generateOTP } = require("../utils/otp_helper");
const { verifyOTP, sendUserToOTP } = require("./otp_controller");

// Store OTPs temporarily (Ideally use Redis)
const otpStorage = new Map();

// Create a new user
const createUser = async (req, res) => {
    try {
        const { email, photoUrl, username, location, bio, followers, following, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // ✅ Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username is already taken" });
        }

        // ✅ Validate email format
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // ✅ Generate OTP and store it temporarily
        const otp = generateOTP();
        otpStorage.set(email, { otp, userData: { email, password, photoUrl, username, location, bio, followers, following }, expiresAt: Date.now() + 10 * 60 * 1000 });

        // ✅ Send OTP via email
        await sendOTP(email, otp);

        res.status(200).json({ message: "OTP sent to email. Please verify to complete registration." });

        // Create a new user (MongoDB will generate _id automatically)
        // const newUser = new User({
        //     email,
        //     password: hashedPassword,
        //     photoUrl,
        //     username,
        //     location,
        //     bio,
        //     followers: followers || [],
        //     following: following || [],
        // });

        // await newUser.save();

        // res.status(201).json({ 
        //     message: "User created successfully", 
        //     user: { ...newUser._doc, uid: newUser._id }  // Send _id as uid
        // });
    } catch (error) {
        // show error in console
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// Verify OTP and create user
const verifyUserOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Retrieve stored OTP
        const storedOtpData = otpStorage.get(email);
        if (!storedOtpData || storedOtpData.otp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        // ✅ Hash password before saving
        const hashedPassword = await bcrypt.hash(storedOtpData.userData.password, 10);

        // ✅ Create and save user
        const newUser = new User({
            email,
            password: hashedPassword,
            photoUrl: '',
            username: storedOtpData.userData.username,
            location: '',
            bio: '',
            followers: storedOtpData.userData.followers || [],
            following: storedOtpData.userData.following || [],
        });

        await newUser.save();
        otpStorage.delete(email); // ✅ Remove OTP after successful registration

        res.status(201).json({ message: "User verified and created successfully", user: { ...newUser._doc, uid: newUser._id } });
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};

// Get user by UID
const getUserByUid = async (req, res) => {
    try {
        const { uid } = req.params;  // uid is actually _id in MongoDB

        // Find the user by _id
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Update user details
const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Get `_id` from request params
        const { photoUrl, location, bio, username } = req.body;

        // ✅ Validate if `id` is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        // ✅ Find the user by `_id`
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Check if username already exists (excluding the current user)
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername && existingUsername._id.toString() !== id) {
                return res.status(400).json({ message: "Username is already taken" });
            }
        }

        // ✅ Update only the provided fields
        if (username !== undefined) user.username = username;
        if (photoUrl !== undefined) user.photoUrl = photoUrl;
        if (location !== undefined) user.location = location;
        if (bio !== undefined) user.bio = bio;

        // ✅ Save updated user
        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// Change user details
const changeUserDetails = async (req, res) => {
    try {
        const { id } = req.params; // Get user ID from request params
        const updateData = req.body; // Get all fields from request body

        // If the request contains a password, hash it before saving
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Find and update the user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true } // Return updated user and run validations
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const deletedUser = await User.findOneAndDelete({ uid });

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

// Follow a user
const followUser = async (req, res) => {
    try {
        const { currentUserId, targetUserId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const currentUser = await User.findById(new mongoose.Types.ObjectId(currentUserId));
        const targetUser = await User.findById(new mongoose.Types.ObjectId(targetUserId));

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (targetUser.followers.includes(currentUserId)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        targetUser.followers.push(currentUserId);
        currentUser.following.push(targetUserId);

        await targetUser.save();
        await currentUser.save();

        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error following user", error: error.message });
    }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
    try {
        const { currentUserId, targetUserId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(targetUserId)) {
            return res.status(400).json({ message: "Invalid user ID format" });
        }

        if (currentUserId === targetUserId) {
            return res.status(400).json({ message: "You cannot unfollow yourself" });
        }

        const currentUser = await User.findById(new mongoose.Types.ObjectId(currentUserId));
        const targetUser = await User.findById(new mongoose.Types.ObjectId(targetUserId));

        if (!currentUser || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!targetUser.followers.includes(currentUserId)) {
            return res.status(400).json({ message: "You are not following this user" });
        }

        targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
        currentUser.following = currentUser.following.filter(id => id !== targetUserId);

        await targetUser.save();
        await currentUser.save();

        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error unfollowing user", error: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        console.log("Login request received:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email or username
        const user = await User.findOne({
            $or: [{ email: email }, { username: email }]
        },);

        console.log("User found:", user);


        if (!user) {
            console.log("User not found in database");
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure the user has a password stored
        if (!user.password) {
            console.log("User exists but password is missing in DB");
            return res.status(500).json({ message: "User password is missing in the database" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password match status:", isMatch);

        if (!isMatch) {
            console.log("Invalid password entered");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("JWT Token generated:", token);

        res.status(200).json({ message: "Login successful", token, user });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

const checkusername = async (req, res) => {
    try {
        const { username } = req.params;
        const userExists = await User.findOne({ username });

        res.status(200).json({ available: !userExists }); // ✅ Explicitly set status 200
    } catch (error) {
        res.status(500).json({ message: "Error checking username", error: error.message });
    }
}

const sendSms = async (req, res) => {
    const { mobileNumber, otp } = req.body;
    if (!mobileNumber) {
        return res.status(400).json({ success: false, message: "Mobile number is required" });
    }

    const result = await sendUserToOTP(mobileNumber, otp);
    res.json(result);
}

const verifySms = async (req, res) => {
    const { mobileNumber, otp } = req.body;
    if (!mobileNumber || !otp) {
        return res.status(400).json({ success: false, message: "Mobile number and OTP are required" });
    }

    const result = await verifyOTP(mobileNumber, otp);
    res.json(result);
}

const searchUser = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ message: "Query parameter is required" });
        }

        console.log("Query:", query); // Debugging

        const users = await User.find(
            { username: { $regex: query, $options: "i" } },
            "_id username photoUrl" // ✅ Only return necessary fields
        );

        console.log("Users:", users); // Debugging

        res.status(200).json(users);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Error searching users", error: error.message });
    }
};







module.exports = { createUser, getUserByUid, updateUser, deleteUser, followUser, unfollowUser, loginUser, changeUserDetails, verifyUserOTP, checkusername, sendSms, verifySms , searchUser};
