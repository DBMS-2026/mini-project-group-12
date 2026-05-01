// Local file upload service — no cloud dependencies
const path = require('path');

const uploadImage = (file) => {
  const url = `/uploads/images/${file.filename}`;
  return { url, filename: file.filename };
};

const uploadVideo = (file) => {
  const url = `/uploads/videos/${file.filename}`;
  return { url, filename: file.filename };
};

module.exports = { uploadImage, uploadVideo };
