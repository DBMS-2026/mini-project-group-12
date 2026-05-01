const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, search, getSuggested } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/suggested', protect, getSuggested);
router.get('/search', protect, search);
router.get('/:username', getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
