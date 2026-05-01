const { uploadImage, uploadVideo, uploadMedia } = require('../config/multer');

const uploadImageMiddleware = uploadImage.single('image');
const uploadVideoMiddleware = uploadVideo.single('video');
const uploadMediaMiddleware = uploadMedia.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

module.exports = {
  uploadImageMiddleware,
  uploadVideoMiddleware,
  uploadMediaMiddleware,
};
