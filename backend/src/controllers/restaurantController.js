const { Restaurant, Post, User, Like, Comment } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { Op } = require('sequelize');

// @desc    Get all restaurants
// @route   GET /api/restaurants
const getRestaurants = async (req, res) => {
  try {
    const { q, location, cuisine, minRating, maxCost } = req.query;
    const where = {};

    if (q) {
      where.name = { [Op.like]: `%${q}%` };
    }
    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }
    if (cuisine) {
      where.cuisine = { [Op.like]: `%${cuisine}%` };
    }
    if (minRating) {
      where.rating = { [Op.gte]: parseFloat(minRating) };
    }
    if (maxCost) {
      where.averageCost = { [Op.lte]: parseInt(maxCost) };
    }

    const restaurants = await Restaurant.findAll({
      where,
      order: [['rating', 'DESC']],
    });

    sendSuccess(res, { restaurants }, 'Restaurants fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get single restaurant by name
// @route   GET /api/restaurants/:name
const getRestaurant = async (req, res) => {
  try {
    const { MenuItem } = require('../models');
    const restaurant = await Restaurant.findOne({
      where: { name: { [Op.like]: `%${req.params.name}%` } },
      include: [
        { model: MenuItem, as: 'menuItems' }
      ]
    });

    if (!restaurant) return sendError(res, 'Restaurant not found', 404);
    sendSuccess(res, { restaurant }, 'Restaurant fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

// @desc    Get posts for a restaurant
// @route   GET /api/restaurants/:name/posts
const getRestaurantPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { restaurant: { [Op.like]: `%${req.params.name}%` } },
      include: [
        { model: User, as: 'user', attributes: ['id', 'fullName', 'username', 'avatar'] },
        { model: Like, as: 'likes', attributes: ['userId'] },
        { model: Comment, as: 'comments', attributes: ['id'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    sendSuccess(res, { posts }, 'Restaurant posts fetched');
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { getRestaurants, getRestaurant, getRestaurantPosts };
