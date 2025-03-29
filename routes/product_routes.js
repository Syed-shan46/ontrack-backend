const express = require("express");
const { createProduct, getProductsByCategory } = require("../controllers/product_controller");
const router = express.Router();

router.post("/create", createProduct); // Create a product
router.get("/category/:name", getProductsByCategory); // Get products by category

module.exports = router;
