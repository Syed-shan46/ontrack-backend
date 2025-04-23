const express = require("express");
const { createBanner, getBannersByUser } = require("../controllers/banner_controller");
const router = express.Router();

router.post('/:userId/create', createBanner);
router.get('/:userId/get-banners', getBannersByUser);
module.exports = router;
