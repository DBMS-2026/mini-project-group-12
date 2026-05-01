const { Follower, User, Notification } = require('../models');

const toggleFollow = async (followerId, followingId) => {
  if (followerId === followingId) throw new Error('Cannot follow yourself');

  const existing = await Follower.findOne({ where: { followerId, followingId } });

  if (existing) {
    await existing.destroy();
    const followerCount = await Follower.count({ where: { followingId } });
    const followingCount = await Follower.count({ where: { followerId } });
    return { following: false, followerCount, followingCount };
  }

  await Follower.create({ followerId, followingId });
  
  // Create notification
  await Notification.create({
    type: 'follow',
    senderId: followerId,
    receiverId: followingId,
    message: 'started following you'
  });

  const followerCount = await Follower.count({ where: { followingId } });
  const followingCount = await Follower.count({ where: { followerId } });
  return { following: true, followerCount, followingCount };
};

const getFollowStatus = async (followerId, followingId) => {
  const existing = await Follower.findOne({ where: { followerId, followingId } });
  return { following: !!existing };
};

const getFollowers = async (userId) => {
  const followers = await Follower.findAll({
    where: { followingId: userId },
    include: [{ model: User, as: 'followerUser', attributes: ['id', 'fullName', 'username', 'avatar'] }],
    order: [['createdAt', 'DESC']],
  });
  return followers.map(f => f.followerUser);
};

const getFollowing = async (userId) => {
  const following = await Follower.findAll({
    where: { followerId: userId },
    include: [{ model: User, as: 'followingUser', attributes: ['id', 'fullName', 'username', 'avatar'] }],
    order: [['createdAt', 'DESC']],
  });
  return following.map(f => f.followingUser);
};

const getFollowCounts = async (userId) => {
  const followerCount = await Follower.count({ where: { followingId: userId } });
  const followingCount = await Follower.count({ where: { followerId: userId } });
  return { followerCount, followingCount };
};

module.exports = { toggleFollow, getFollowStatus, getFollowers, getFollowing, getFollowCounts };
