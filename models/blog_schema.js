const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    subtitle: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: [
            'Restaurant Experiences',
            'Food Recipes',
            'Healthy Eating',
            'World Cuisines',
            'Travel & Food',
            'Drinks & Beverages',
            'Food Reviews',
            'Special Occasions',
            'Cooking Tips & Hacks',
            'Baking Delights',
            'Trending Foods',
            'Vegan & Vegetarian',
            'Food Stories',
        ],
        required: true,
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author', // assuming you have a User model
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    categoryTags: {
        type: [String], // e.g., ['tech', 'travel']
        default: []
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    likes: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
