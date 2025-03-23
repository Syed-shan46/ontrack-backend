const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/auth_routes');
const categoryRoutes = require('./routes/category_routes');
const productRoutes = require('./routes/product_routes');
const resetPasswordRoutes = require('./routes/reset_password_routes');
const postRoutes = require('./routes/post_routes');
const storyRoutes = require('./routes/story_routes');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use("/api/users",userRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/products",productRoutes);
app.use("/api/reset-password",resetPasswordRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/stories",storyRoutes);
app.use(cors());

// Start the server 
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err),);
  