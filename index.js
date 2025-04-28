const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user_routes');
const categoryRoutes = require('./routes/category_routes');
const productRoutes = require('./routes/product_routes');
const resetPasswordRoutes = require('./routes/reset_password_routes');
const postRoutes = require('./routes/post_routes');
const storyRoutes = require('./routes/story_routes');
const bannerRoutes = require('./routes/banner_routes');
const aboutRoutes = require('./routes/about_routes');
const authorRoutes = require('./routes/author_routes');
const blogRoutes = require('./routes/blog_routes');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reset-password", resetPasswordRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/banners", bannerRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/author/', authorRoutes);
app.use('/api/blog',blogRoutes);


app.use(cors());

// Start the server 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 sec
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err),);
