const Product = require("../models/product_schema");
const Category = require("../models/category_schema");
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

exports.getProductsByCategory = async (req, res) => {
    try {
        const { name } = req.params;

        // Find the category by name
        const category = await Category.findOne({ name: name });

        console.log("Category Found:", category);

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Find products using the category ID
        const products = await Product.find({ category: category._id });

        console.log("Products Found:", products);

        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error: error.message });
    }
};

