const { SavedPost, Post, User, Like, Comment } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Toggle save on a post
// @route   POST /api/saves/:postId/toggle
const toggleSave = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const existing = await SavedPost.findOne({ where: { postId, userId } });

    if (existing) {
      await existing.destroy();
      return sendSuccess(res, { saved: false }, 'Post unsaved');
    }

    await SavedPost.create({ postId, userId });
    sendSuccess(res, { saved: true }, 'Post saved');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get saved posts
// @route   GET /api/saves
const getSavedPosts = async (req, res) => {
  try {
    const savedPosts = await SavedPost.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Post,
          as: 'post',
          include: [
            { model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] },
            { model: Like, as: 'likes', attributes: ['userId'] },
            { model: Comment, as: 'comments', attributes: ['id'] },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const posts = savedPosts.map((sp) => sp.post);
    sendSuccess(res, { posts }, 'Saved posts fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Check if post is saved
// @route   GET /api/saves/:postId/check
const checkSaved = async (req, res) => {
  try {
    const existing = await SavedPost.findOne({
      where: { postId: req.params.postId, userId: req.user.id },
    });
    sendSuccess(res, { saved: !!existing }, 'Save status');
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { toggleSave, getSavedPosts, checkSaved };
