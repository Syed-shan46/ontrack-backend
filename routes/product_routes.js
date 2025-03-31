const express = require("express");
const { createProduct, getProductsByCategoryAndUser } = require("../controllers/product_controller");
const router = express.Router();

router.post("/create", createProduct); // Create a product
router.get("/:categoryId/:userId", getProductsByCategoryAndUser); // Get products by category

module.exports = router;
