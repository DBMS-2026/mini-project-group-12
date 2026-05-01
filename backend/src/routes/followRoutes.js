const express = require('express');
const router = express.Router();
const { toggleFollow, getFollowStatus, getFollowers, getFollowing } = require('../controllers/followController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:userId/toggle', protect, toggleFollow);
router.get('/:userId/status', protect, getFollowStatus);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

module.exports = router;
