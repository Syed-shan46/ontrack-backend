const express = require("express");
const { createStory } = require("../controllers/story_controller");


const router = express.Router();

router.post("/create", createStory);                      // register user

module.exports = router;
