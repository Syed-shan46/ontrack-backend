const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Author = require('./models/author_schema');
const cors = require('cors');
require('dotenv').config();

// Import routes
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

// Initialize the app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server);

// Middleware to parse JSON bodies
app.use(express.json());

// Use routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reset-password", resetPasswordRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/banners", bannerRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/author', authorRoutes);
app.use('/api/blog', blogRoutes);

// Enable CORS
app.use(cors());

// Socket.io event handling
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", async (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);

    // Emit current data immediately after joining
    const author = await Author.findById(userId);
    if (author) {
      io.to(userId).emit("followUpdate", {
        followersCount: author.followerCount,
        followingCount: author.followingCount,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});


app.set("io", io); // Make io available in routes/controllers

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 sec
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err),);
