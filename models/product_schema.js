const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // Owner of the product
    name: { type: String, required: true },
    photoUrl: { type: String, required: true }, // Product image
    price: { type: Number, required: true },
    description: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    category: { type: mongoose.Types.ObjectId, ref: "Category", required: true }, // Reference to Category model
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
