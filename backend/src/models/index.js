const { sequelize } = require('../config/db');
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const Like = require('./Like');
const SavedPost = require('./SavedPost');
const Restaurant = require('./Restaurant');
const Follower = require('./Follower');
const Notification = require('./Notification');
const MenuItem = require('./MenuItem');
const Order = require('./Order');

// ---- Associations ----

// User <-> Post
User.hasMany(Post, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Post <-> Comment
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User <-> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Post <-> Like
Post.hasMany(Like, { foreignKey: 'postId', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User <-> Like
User.hasMany(Like, { foreignKey: 'userId', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Post <-> SavedPost
Post.hasMany(SavedPost, { foreignKey: 'postId', as: 'savedBy', onDelete: 'CASCADE' });
SavedPost.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// User <-> SavedPost
User.hasMany(SavedPost, { foreignKey: 'userId', as: 'savedPosts', onDelete: 'CASCADE' });
SavedPost.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User <-> Follower (Follow/Unfollow system)
User.hasMany(Follower, { foreignKey: 'followerId', as: 'following', onDelete: 'CASCADE' });
User.hasMany(Follower, { foreignKey: 'followingId', as: 'followers', onDelete: 'CASCADE' });
Follower.belongsTo(User, { foreignKey: 'followerId', as: 'followerUser' });
Follower.belongsTo(User, { foreignKey: 'followingId', as: 'followingUser' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'receiverId', as: 'notificationsReceived', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Notification.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Notification.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// Restaurant <-> MenuItem
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId', as: 'menuItems', onDelete: 'CASCADE' });
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

// User <-> Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Restaurant <-> Order
Restaurant.hasMany(Order, { foreignKey: 'restaurantId', as: 'orders', onDelete: 'CASCADE' });
Order.belongsTo(Restaurant, { foreignKey: 'restaurantId', as: 'restaurant' });

module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Like,
  SavedPost,
  Restaurant,
  Follower,
  Notification,
  MenuItem,
  Order,
};
