const { Notification, User, Post } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { receiverId: req.user.id },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'fullName', 'avatar'] },
        { model: Post, as: 'post', attributes: ['id', 'imageUrl', 'type'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    sendSuccess(res, { notifications }, 'Notifications fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { receiverId: req.user.id, isRead: false } }
    );
    sendSuccess(res, {}, 'Notifications marked as read');
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { getNotifications, markAsRead };
