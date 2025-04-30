const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    follower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author', // or 'User' depending on your design
        required: true
    },
    // Inside Author schema
    followingAuthors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
    followingUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    targetType: {
        type: String,
        enum: ['Author', 'User'],
        required: true
    }
}, { timestamps: true });


// Create the User model
const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
