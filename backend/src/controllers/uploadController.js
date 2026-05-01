const { uploadImage, uploadVideo } = require('../services/uploadService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Upload image (local disk)
// @route   POST /api/upload/image
const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No image file provided', 400);
    const result = uploadImage(req.file);
    sendSuccess(res, result, 'Image uploaded', 201);
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Upload video (local disk)
// @route   POST /api/upload/video
const handleVideoUpload = async (req, res) => {
  try {
    if (!req.file) return sendError(res, 'No video file provided', 400);
    const result = uploadVideo(req.file);
    sendSuccess(res, result, 'Video uploaded', 201);
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { handleImageUpload, handleVideoUpload };
