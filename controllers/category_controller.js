const Category = require("../models/category_schema");
const mongoose = require("mongoose");

exports.createCategory = async (req, res) => {
    try {
        const { userId, name, image } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const newCategory = new Category({ userId, name, image });
        await newCategory.save();

        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

// Get all categories of a user
exports.getCategories = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const categories = await Category.find({ userId });
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};
