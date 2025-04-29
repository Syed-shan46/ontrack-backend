const Author = require('../models/author_schema');
const bcrypt = require("bcryptjs");
const { sendOTP, generateOTP } = require("../utils/otp_helper");
const jwt = require("jsonwebtoken");

// Store OTPs temporarily (Ideally use Redis)
const otpStorage = new Map();

exports.createAuthor = async (req, res) => {
    try {
        const { email, profilePicture, username, password, bio, topics, socialLinks, following } = req.body;

        // Check if the user already exists
        const existingUser = await Author.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered. Please use a different email." });
        }
        // ✅ Check if username already exists
        const existingUsername = await Author.findOne({ username });
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
        otpStorage.set(email, { otp, userData: { email, password, profilePicture, username, bio, topics, socialLinks }, expiresAt: Date.now() + 10 * 60 * 1000 });

        // ✅ Send OTP via email
        await sendOTP(email, otp);

        res.status(200).json({ message: "OTP sent to email. Please verify to complete registration." });

    } catch (error) {
        // show error in console
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

// Verify OTP and create user
exports.verifyAuthorOTP = async (req, res) => {
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
        const newAuthor = new Author({
            email,
            password: hashedPassword,
            profilePicture: storedOtpData.userData.profilePicture || '',
            username: storedOtpData.userData.username,
            bio: storedOtpData.userData.bio,
            following: [],
            topics: storedOtpData.userData.topics || [],
            socialLinks: storedOtpData.userData.socialLinks || {}
        });


        await newAuthor.save();
        otpStorage.delete(email); // ✅ Remove OTP after successful registration

        res.status(201).json({ message: "User verified and created successfully", author: { ...newAuthor._doc, uid: newAuthor._id } });
    } catch (error) {
        res.status(500).json({ message: "Error verifying OTP", error: error.message });
    }
};


exports.updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { username, bio, profilePicture, socialLinks } = req.body;

    try {
        const user = await Author.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.profilePicture = profilePicture || user.profilePicture;
        user.socialLinks = {
            ...user.socialLinks,
            ...socialLinks,
        };

        await user.save();
        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// controllers/authorController.js

exports.updateAuthorTopics = async (req, res) => {
    try {
        const { id } = req.params;
        const { topics } = req.body;

        const author = await Author.findByIdAndUpdate(
            id,
            { topics },
            { new: true }
        );

        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }

        res.status(200).json({ message: "Topics updated", author });
    } catch (error) {
        res.status(500).json({ message: "Error updating topics", error: error.message });
    }
};

exports.loginAuthor = async (req, res) => {
    try {
        console.log("Login request received:", req.body);

        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Missing email or password");
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user by email or username
        const author = await Author.findOne({
            $or: [{ email: email }, { username: email }]
        },);

        console.log("User found:", author);


        if (!author) {
            console.log("User not found in database");
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure the user has a password stored
        if (!author.password) {
            console.log("User exists but password is missing in DB");
            return res.status(500).json({ message: "User password is missing in the database" });
        }

        const isMatch = await bcrypt.compare(password, author.password);
        console.log("Password match status:", isMatch);

        if (!isMatch) {
            console.log("Invalid password entered");
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ uid: author.uid }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("JWT Token generated:", token);

        res.status(200).json({ message: "Login successful", token, author });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};




