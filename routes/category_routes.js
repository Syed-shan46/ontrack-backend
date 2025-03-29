const express = require("express");
const { createCategory, getCategories } = require("../controllers/category_controller");
const router = express.Router();

router.post("/create", createCategory); // Create a category
router.get("/all", getCategories); // Get all categories of a user

module.exports = router;
