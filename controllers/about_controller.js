const About = require("../models/about_schema");


exports.createAboutInfo = async (req, res) => {

  try {
    const userId = req.params.userId;
    const { description, tags, phone } = req.body;

    const about = new About({
      userId,
      description,
      tags,
      phone,
    });

    await about.save();
    console.log('userId', userId);

    res.status(201).json({ message: "About info created successfully", about });
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({ message: "Error creating about info", error: error.message });
  }
};

exports.updateAboutInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const { description, tags, phone } = req.body;

    const updatedAbout = await About.findOneAndUpdate(
      { userId: userId }, // Match by user ID
      { description, tags, phone }, // Fields to update
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedAbout) {
      return res.status(404).json({ message: "About info not found" });
    }

    res.status(200).json({ message: "About info updated successfully", about: updatedAbout });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating about info", error: error.message });
  }
};


exports.getAboutByUserId = async (req, res) => {
  try {
    const about = await About.findOne({ userId: req.params.userId });
    if (!about) {
      return res.status(404).json({ message: "About info not found" });
    }
    res.status(200).json({ about });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete about info
// @route   DELETE /api/about
// @access  Private
exports.deleteAbout = async (req, res) => {
  try {
    const result = await About.findOneAndDelete({ user: req.user._id });
    if (!result) {
      return res.status(404).json({ message: "Nothing to delete" });
    }
    res.status(200).json({ message: "About info deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
