const express = require('express');
const { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog, getBlogsByUser } = require('../controllers/blog_controller');
const router = express.Router();

router.post('/:id/create', createBlog);

router.get('/', getAllBlogs);

router.get('/:id', getBlogById);

router.put('/:id/:userId/update', updateBlog);

router.delete('/:id', deleteBlog);

router.get('/user/:userId', getBlogsByUser);

module.exports = router;
