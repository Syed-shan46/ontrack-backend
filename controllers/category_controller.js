const Category = require("../models/category_schema");
const Product = require("../models/product_schema"); // Assuming you have a Product model

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

exports.getCategoriesByUser = async (req, res) => {
    const userId = req.params.userId; // or req.user._id if using authentication middleware

    try {
        const categories = await Category.find();

        const categoriesWithCount = await Promise.all(
            categories.map(async (category) => {
                const count = await Product.countDocuments({
                    category: category._id,
                    userId: userId,
                });

                return {
                    ...category.toObject(),
                    productCount: count,
                };
            })
        );

        // Only return categories with at least 1 product for this user
        const filtered = categoriesWithCount.filter(c => c.productCount > 0);

        res.status(200).json({ categories: filtered });
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories", error: error.message });
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

