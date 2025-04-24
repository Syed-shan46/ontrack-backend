const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    photoUrl: {
        type: String,
        default: ""
    },

    username: {
        type: String,
        required: true,
        unique: true,
    },

    location: { type: String, required: false, default: "" },
    bio: { type: String, required: false, default: "" },


    followers: { type: [String], default: [] },

    following: { type: [String], default: [] }

}, { timestamps: true });

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
