
const express = require("express");
const { getAboutByUserId, deleteAbout, createAboutInfo, updateAboutInfo } = require("../controllers/about_controller");
const router = express.Router();

router.post('/:userId/create', createAboutInfo);
router.put('/:userId/update', updateAboutInfo);
router.get('/:userId', getAboutByUserId);
router.delete('/', deleteAbout);

module.exports = router;