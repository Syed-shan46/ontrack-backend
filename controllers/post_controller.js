const Post = require('../models/post_shema');

// ✅ Create a new post
exports.createPost = async (req, res) => {
    try {
        const { caption, author, tags, image, allowComments } = req.body;

        const post = new Post({ caption, author, tags, image, allowComments: allowComments ?? true });
        await post.save();

        res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Error creating post", error: error.message });
    }
};

// ✅ Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', 'name').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Error fetching posts", error: error.message });
    }
};

// ✅ Get a single post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name').populate('comments.user', 'name');
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "Error fetching post", error: error.message });
    }
};

// get post by user id
// ✅ Get posts by user ID
exports.getPostsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ author: userId }).populate('author', 'name').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts by user:", error);
        res.status(500).json({ message: "Error fetching posts by user", error: error.message });
    }
}

// ✅ Update a post
exports.updatePost = async (req, res) => {
    try {
        const { content, tags, image } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { title, content, tags, image }, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post updated successfully", updatedPost });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "Error updating post", error: error.message });
    }
};

// ✅ Delete a post
exports.deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Error deleting post", error: error.message });
    }
};

// ✅ Like a post
exports.likePost = async (req, res) => {
    try {
        const { userId } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Toggle like (add or remove)
        const index = post.likes.indexOf(userId);
        if (index === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(index, 1);
        }

        await post.save();
        res.status(200).json({ message: "Post like updated", likes: post.likes.length });
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ message: "Error liking post", error: error.message });
    }
};

// ✅ Add a comment
exports.addComment = async (req, res) => {
    try {
        const { user, text } = req.body;
        if (!user || !text) {
            return res.status(400).json({ message: "User and text are required" });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({ user, text });
        await post.save();

        res.status(201).json({ message: "Comment added successfully", comments: post.comments });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

// ✅ Toggle availability of comments
exports.toggleAllowComments = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.allowComments = !post.allowComments;
        await post.save();

        res.status(200).json({ message: "Post comment availability updated", allowComments: post.allowComments });
    } catch (error) {
        console.error("Error toggling comment availability:", error);
        res.status(500).json({ message: "Error toggling comment availability", error: error.message });
    }
};
