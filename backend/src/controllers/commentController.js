const { Comment, User, Post, Notification } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Add comment to post
// @route   POST /api/comments/:postId
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return sendError(res, 'Comment text is required', 400);

    const comment = await Comment.create({
      postId: req.params.postId,
      userId: req.user.id,
      text,
    });

    const fullComment = await Comment.findByPk(comment.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] }],
    });

    // Create notification
    const post = await Post.findByPk(req.params.postId);
    if (post && post.userId !== req.user.id) {
      await Notification.create({
        type: 'comment',
        senderId: req.user.id,
        receiverId: post.userId,
        postId: post.id,
        message: `commented: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`
      });
    }

    sendSuccess(res, { comment: fullComment }, 'Comment added', 201);
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
const getComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      include: [{ model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']],
    });

    sendSuccess(res, { comments }, 'Comments fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return sendError(res, 'Comment not found', 404);
    if (comment.userId !== req.user.id) return sendError(res, 'Not authorized', 403);

    await comment.destroy();
    sendSuccess(res, null, 'Comment deleted');
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { addComment, getComments, deleteComment };
