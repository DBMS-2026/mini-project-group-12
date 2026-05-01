const { getUserProfile, updateUserProfile, searchUsers, getSuggestedUsers } = require('../services/userService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Get user profile by username
// @route   GET /api/users/:username
const getProfile = async (req, res) => {
  try {
    const profile = await getUserProfile(req.params.username);
    sendSuccess(res, { profile }, 'Profile fetched');
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

// @desc    Update own profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const updated = await updateUserProfile(req.user.id, req.body);
    sendSuccess(res, { user: updated }, 'Profile updated');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

// @desc    Search users
// @route   GET /api/users/search?q=query
const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return sendSuccess(res, { users: [] }, 'No query');
    const users = await searchUsers(q);
    sendSuccess(res, { users }, 'Search results');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get suggested users to follow
// @route   GET /api/users/suggested
const getSuggested = async (req, res) => {
  try {
    const suggested = await getSuggestedUsers(req.user.id);
    sendSuccess(res, { suggested }, 'Suggested users fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { getProfile, updateProfile, search, getSuggested };
