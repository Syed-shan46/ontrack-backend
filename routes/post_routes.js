const express = require('express');
const router = express.Router();
const { createPost, getPosts, getPostById, updatePost, deletePost, likePost, addComment, toggleAllowComments, getPostsByUser } = require('../controllers/post_controller');

router.post('/create', createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.get('/user/:userId', getPostsByUser);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', likePost);
router.post('/:id/comment', addComment);
router.patch('/:id/toggle-comments', toggleAllowComments);

module.exports = router;
