const express = require('express');
const { createAuthor, verifyAuthorOTP, updateUserProfile, updateAuthorTopics, loginAuthor, getAuthorStats, getFollowlist, getFollowersList } = require('../controllers/author_controller');
const router = express.Router();

// Route to create a new author user (with OTP verification)
router.post('/register', createAuthor);
router.post("/verify-otp", verifyAuthorOTP);               // Verify OTP
router.put('/update/:id', updateUserProfile);
router.post('/login', loginAuthor);
router.put('/update-topics/:id', updateAuthorTopics);
router.get('/get-count/:id', getAuthorStats);
router.get('/:authorId/following', getFollowlist);
router.get('/:authorId/followers', getFollowersList);


module.exports = router;
