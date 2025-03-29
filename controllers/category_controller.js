const Category = require("../models/category_schema");

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new Category({ name });
        await newCategory.save();

        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating category", error: error.message });
    }
};

// Get all categories of a user
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find(); // Fetch all categories
        res.status(200).json({ categories });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};
