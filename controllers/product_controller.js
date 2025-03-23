const Product = require("../models/product_schema");
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
    try {
        const { userId, name, photoUrl, price, isAvailable, category,description } = req.body;

        

        const newProduct = new Product({ userId, name, photoUrl, price, isAvailable, category,description });
        await newProduct.save();

        res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID" });
        }

        const products = await Product.find({ category: categoryId });
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

