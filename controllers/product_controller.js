const Product = require("../models/product_schema");
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
    try {
        const { userId, name, photoUrl, price, isAvailable, category, description } = req.body;


        // Convert category to ObjectId
        const categoryId = mongoose.Types.ObjectId.createFromHexString(category);


        const newProduct = new Product({ userId, name, photoUrl, price, isAvailable, category: categoryId, description, });
        await newProduct.save();

        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// ✅ Get products by category and user
exports.getProductsByCategoryAndUser = async (req, res) => {
    try {
        const { categoryId, userId } = req.params;

        // Validate categoryId and userId
        if (!mongoose.isValidObjectId(categoryId) || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid category ID or user ID" });
        }

        // Find products that match both category and user
        const products = await Product.find({
            category: categoryId,
            userId: userId,
        })
        .populate('category', 'name') // Optional: Populates category name
        .populate('userId', 'name email'); // Optional: Populates user details

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this category and user." });
        }

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};




