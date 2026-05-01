const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurant, getRestaurantPosts } = require('../controllers/restaurantController');

router.get('/', getRestaurants);
router.get('/:name', getRestaurant);
router.get('/:name/posts', getRestaurantPosts);

module.exports = router;
