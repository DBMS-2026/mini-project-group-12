const followService = require('../services/followService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Toggle follow/unfollow
// @route   POST /api/follows/:userId/toggle
const toggleFollow = async (req, res) => {
  try {
    const result = await followService.toggleFollow(req.user.id, parseInt(req.params.userId));
    sendSuccess(res, result, result.following ? 'Followed' : 'Unfollowed');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

// @desc    Check if following
// @route   GET /api/follows/:userId/status
const getFollowStatus = async (req, res) => {
  try {
    const result = await followService.getFollowStatus(req.user.id, parseInt(req.params.userId));
    sendSuccess(res, result, 'Follow status');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get followers of a user
// @route   GET /api/follows/:userId/followers
const getFollowers = async (req, res) => {
  try {
    const followers = await followService.getFollowers(parseInt(req.params.userId));
    sendSuccess(res, { followers }, 'Followers fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get following of a user
// @route   GET /api/follows/:userId/following
const getFollowing = async (req, res) => {
  try {
    const following = await followService.getFollowing(parseInt(req.params.userId));
    sendSuccess(res, { following }, 'Following fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { toggleFollow, getFollowStatus, getFollowers, getFollowing };
