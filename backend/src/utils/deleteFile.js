const cloudinary = require('../config/cloudinary');

const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error.message);
    throw error;
  }
};

module.exports = deleteFile;
