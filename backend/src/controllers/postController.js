const postService = require('../services/postService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// @desc    Create new post
// @route   POST /api/posts
const createPost = async (req, res) => {
  try {
    const { caption, imageUrl, videoUrl, restaurant, mapLink, type } = req.body;

    const post = await postService.createPost({
      userId: req.user.id,
      caption,
      imageUrl: imageUrl || null,
      videoUrl: videoUrl || null,
      restaurant: restaurant || null,
      mapLink: mapLink || null,
      type: type || 'post',
    });

    sendSuccess(res, { post }, 'Post created', 201);
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get all posts (feed)
// @route   GET /api/posts
const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await postService.getAllPosts(page, limit);
    sendSuccess(res, result, 'Posts fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get reels
// @route   GET /api/posts/reels
const getReels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await postService.getReels(page, limit);
    sendSuccess(res, result, 'Reels fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
const getPost = async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) return sendError(res, 'Post not found', 404);
    sendSuccess(res, { post }, 'Post fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
const deletePost = async (req, res) => {
  try {
    const result = await postService.deletePost(req.params.id, req.user.id);
    sendSuccess(res, result, 'Post deleted');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

// @desc    Get posts by username
// @route   GET /api/posts/user/:username
const getUserPosts = async (req, res) => {
  try {
    const posts = await postService.getUserPosts(req.params.username);
    sendSuccess(res, { posts }, 'User posts fetched');
  } catch (error) {
    sendError(res, error.message, 404);
  }
};

module.exports = { createPost, getPosts, getReels, getPost, deletePost, getUserPosts };
