const { Like, Post, Notification } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Toggle like on a post
// @route   POST /api/likes/:postId/toggle
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existingLike = await Like.findOne({ where: { postId, userId } });

    if (existingLike) {
      await existingLike.destroy();
      const count = await Like.count({ where: { postId } });
      return sendSuccess(res, { liked: false, likeCount: count }, 'Post unliked');
    }

    await Like.create({ postId, userId });
    
    // Create notification
    const post = await Post.findByPk(postId);
    if (post && post.userId !== userId) {
      await Notification.create({
        type: 'like',
        senderId: userId,
        receiverId: post.userId,
        postId: post.id,
        message: 'liked your post'
      });
    }

    const count = await Like.count({ where: { postId } });
    sendSuccess(res, { liked: true, likeCount: count }, 'Post liked');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get like count + check if user liked
// @route   GET /api/likes/:postId
const getLikeStatus = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    const count = await Like.count({ where: { postId } });
    let liked = false;

    if (userId) {
      const existing = await Like.findOne({ where: { postId, userId } });
      liked = !!existing;
    }

    sendSuccess(res, { likeCount: count, liked }, 'Like status fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { toggleLike, getLikeStatus };
