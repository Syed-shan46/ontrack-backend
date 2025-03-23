const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    
    caption: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Changed from 'User' to 'Owner' to match user_schema.js
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'  // Changed from 'User' to 'Owner'
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'  // Changed from 'User' to 'Owner'
        },
        text: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    tags: [{
        type: String,
        trim: true
    }],
    image: {
        type: String
    },
    allowComments: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ tags: 1 });

const Post = mongoose.model('Post', postSchema);

module.exports = Post; 