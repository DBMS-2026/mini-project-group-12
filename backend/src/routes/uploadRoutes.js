const express = require('express');
const router = express.Router();
const { handleImageUpload, handleVideoUpload } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const { uploadImageMiddleware, uploadVideoMiddleware } = require('../middleware/uploadMiddleware');

router.post('/image', protect, uploadImageMiddleware, handleImageUpload);
router.post('/video', protect, uploadVideoMiddleware, handleVideoUpload);

module.exports = router;
