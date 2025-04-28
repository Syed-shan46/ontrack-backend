const Blog = require('../models/blog_schema');

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const authorId = req.params.id
        const { title, subtitle, content, imageUrl, category, tags, authorName, categoryTags } = req.body;

        const blog = new Blog({
            title,
            subtitle,
            content,
            imageUrl,
            category,
            tags,
            categoryTags,
            authorName,
            author: authorId, // assuming user is attached to req.user by auth middleware
        });

        await blog.save();

        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            blog,
        });
    } catch (error) {
        console.error('Create Blog Error:', error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'name') // populate author's name
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json({
            success: true,
            blogs,
        });
    } catch (error) {
        console.error('Get Blogs Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
        });
    }
};

// Get a single blog
exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        res.status(200).json({
            success: true,
            blog,
        });
    } catch (error) {
        console.error('Get Blog By ID Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog',
        });
    }
};

// Get all blogs by a specific user
exports.getBlogsByUser = async (req, res) => {
    try {
        const userId = req.params.userId; // Get userId from URL params

        const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            blogs,
        });
    } catch (error) {
        console.error('Get Blogs By User Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs',
        });
    }
};

// Update a blog
exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.params.userId;
        const {
            title,
            subtitle,
            content,
            imageUrl,
            category,
            isPublished,
        } = req.body;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Correct: get userId from req.user (NOT from params)
        if (blog.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this blog',
            });
        }

        // Update fields
        blog.title = title || blog.title;
        blog.subtitle = subtitle || blog.subtitle;
        blog.content = content || blog.content;
        blog.imageUrl = imageUrl || blog.imageUrl;
        blog.category = category || blog.category;
        blog.isPublished = isPublished ?? blog.isPublished;
        // blog.updatedAt = Date.now(); // no need if timestamps:true

        await blog.save();

        res.status(200).json({
            success: true,
            message: 'Blog updated successfully',
            blog,
        });
    } catch (error) {
        console.error('Update Blog Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update blog',
        });
    }
};


// Delete a blog
exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
        }

        // Check if user is owner (optional security check)
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this blog',
            });
        }

        await blog.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Blog deleted successfully',
        });
    } catch (error) {
        console.error('Delete Blog Error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete blog',
        });
    }
};
