const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },

    // following a author to author:
    followingAuthors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        default: []
    }],

    // Following a Author to res
    followingUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],

    // Followers (only authors can follow authors)
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        default: []
    }],

    followingCount: {
        type: Number,
        default: 0,
    },

    followerCount: {
        type: Number,
        default: 0,
    },

    profilePicture: {
        type: String // URL to Cloudinary or local path
    },


    bio: {
        type: String
    },
    topics: {
        type: [String], // e.g., ['tech', 'travel']
        default: []
    },
    socialLinks: {
        twitter: { type: String },
        instagram: { type: String },
        linkedin: { type: String },
        website: { type: String }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});


const Author = mongoose.model('Author', authorSchema);

module.exports = Author;