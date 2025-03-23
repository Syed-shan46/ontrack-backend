const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // Each user creates their own categories
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL of the category image
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
