const express = require('express');
const router = express.Router();
const { toggleSave, getSavedPosts, checkSaved } = require('../controllers/saveController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:postId/toggle', protect, toggleSave);
router.get('/', protect, getSavedPosts);
router.get('/:postId/check', protect, checkSaved);

module.exports = router;
