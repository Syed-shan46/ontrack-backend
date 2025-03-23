const Story = require('../models/story_schema');
const User = require('../models/user_schema');

// ✅ Create a new story
exports.createStory = async (req, res) => {
    try {
        const {image,author} = req.body;
        const story = new Story({ image,author });
        await story.save();
        res.status(201).json({ message: "Story created successfully", story });
    } catch (error) {
        console.error("Error creating story:", error);
        res.status(500).json({ message: "Error creating story", error: error.message });
    }
}