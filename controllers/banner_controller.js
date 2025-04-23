const Banner = require('../models/banner_scheme');

exports.createBanner = async (req, res) => {
  const userId = req.params.userId;  // Get the userId from the URL parameter
  const { imageUrl, title, subtitle } = req.body; // Get the imageUrl from the body

  if (!imageUrl) {
    return res.status(400).json({ message: 'Image URL is required' });
  }

  //console.log('Received userId:', userId);  // Log userId for debugging

  try {
    // Create new banner
    const banner = new Banner({
      userId: userId,  // Use userId instead of user
      image: imageUrl,
      title: title,
      subtitle: subtitle,
    });

    await banner.save();

    res.status(201).json({ message: 'Banner created', banner });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get banner by userId
exports.getBannersByUser = async (req, res) => {
  const userId = req.params.userId;  // Get the userId from the URL parameter

  try {
    // Find banners by userId
    const banners = await Banner.find({ userId: userId });

    if (!banners || banners.length === 0) {
      return res.status(404).json({ message: 'No banners found for this user' });
    }

    res.status(200).json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

