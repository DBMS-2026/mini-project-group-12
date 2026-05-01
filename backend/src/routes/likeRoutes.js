const express = require('express');
const router = express.Router();
const { toggleLike, getLikeStatus } = require('../controllers/likeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:postId/toggle', protect, toggleLike);
router.get('/:postId', protect, getLikeStatus);

module.exports = router;
