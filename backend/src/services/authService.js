const { User } = require('../models');
const hashPassword = require('../utils/hashPassword');
const comparePassword = require('../utils/comparePassword');
const generateToken = require('../utils/generateToken');

const registerUser = async ({ fullName, username, email, phone, password }) => {
  // Check if user exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    throw new Error('Username already taken');
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    fullName,
    username,
    email,
    phone: phone || '',
    password: hashedPassword,
  });

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      avatar: user.avatar,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.password) {
    throw new Error('No password set for this account');
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      avatar: user.avatar,
    },
    token,
  };
};

const crypto = require('crypto');
const { Op } = require('sequelize');

const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('There is no user with that email address');
  }

  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Set expire to 10 minutes
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  return resetToken;
};

const resetPassword = async (resetToken, newPassword) => {
  // Get hashed token
  const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  const user = await User.findOne({
    where: {
      resetPasswordToken,
      resetPasswordExpire: { [Op.gt]: Date.now() },
    },
  });

  if (!user) {
    throw new Error('Invalid or expired token');
  }

  // Set new password
  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;

  await user.save();

  return true;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  if (!user.password) {
    throw new Error('No password set for this account');
  }

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new Error('Incorrect current password');
  }

  user.password = await hashPassword(newPassword);
  await user.save();
  return true;
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, changePassword };
