const { User, Post, Follower } = require('../models');
const { Op } = require('sequelize');

const getUserProfile = async (username) => {
  const user = await User.findOne({
    where: { username },
    attributes: { exclude: ['password'] },
  });

  if (!user) throw new Error('User not found');

  const postCount = await Post.count({ where: { userId: user.id } });
  const followerCount = await Follower.count({ where: { followingId: user.id } });
  const followingCount = await Follower.count({ where: { followerId: user.id } });

  return {
    ...user.toJSON(),
    postCount,
    followers: followerCount,
    following: followingCount,
  };
};

const updateUserProfile = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const { fullName, username, phone, bio, avatar, address } = updateData;

  if (username && username !== user.username) {
    const existing = await User.findOne({ where: { username } });
    if (existing) throw new Error('Username already taken');
  }

  if (fullName) user.fullName = fullName;
  if (username) user.username = username;
  if (phone !== undefined) user.phone = phone;
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;
  if (address !== undefined) user.address = address;

  await user.save();

  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
    avatar: user.avatar,
    address: user.address,
  };
};

const searchUsers = async (query) => {
  const users = await User.findAll({
    where: {
      [Op.or]: [
        { username: { [Op.like]: `%${query}%` } },
        { fullName: { [Op.like]: `%${query}%` } },
      ],
    },
    attributes: ['id', 'fullName', 'username', 'avatar'],
    limit: 20,
  });

  return users;
};

const getSuggestedUsers = async (userId, limit = 5) => {
  // Find users the current user is following
  const following = await Follower.findAll({
    where: { followerId: userId },
    attributes: ['followingId']
  });
  
  const followingIds = following.map(f => f.followingId);
  followingIds.push(userId); // Exclude self
  
  // Find users not in following list
  const suggested = await User.findAll({
    where: {
      id: {
        [Op.notIn]: followingIds
      }
    },
    attributes: ['id', 'username', 'fullName', 'avatar'],
    limit,
    order: [['createdAt', 'DESC']]
  });
  
  return suggested;
};

module.exports = { getUserProfile, updateUserProfile, searchUsers, getSuggestedUsers };
