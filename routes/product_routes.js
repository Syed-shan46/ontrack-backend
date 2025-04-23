const express = require("express");
const { createProduct, getProductsByCategoryAndUser, getProductsByUser, getRandomProductsByUser } = require("../controllers/product_controller");
const router = express.Router();

router.post("/create", createProduct); // Create a product
router.get("/:categoryId/:userId", getProductsByCategoryAndUser); // Get products by category
router.get("/:userId", getProductsByUser); // Get all products of a user
module.exports = router;
