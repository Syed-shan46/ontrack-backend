const express = require("express");
const { createProduct, getProductsByCategory } = require("../controllers/product_controller");
const router = express.Router();

router.post("/create", createProduct); // Create a product
router.get("/category/:categoryId", getProductsByCategory); // Get products by category

module.exports = router;
