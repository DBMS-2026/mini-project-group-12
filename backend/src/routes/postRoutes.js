const express = require('express');
const router = express.Router();
const { createPost, getPosts, getReels, getPost, deletePost, getUserPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.get('/reels', getReels);
router.post('/', protect, createPost);
router.get('/user/:username', getUserPosts);
router.get('/:id', getPost);
router.delete('/:id', protect, deletePost);

module.exports = router;
