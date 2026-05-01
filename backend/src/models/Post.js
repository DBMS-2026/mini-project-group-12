const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  caption: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  restaurant: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  mapLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('post', 'reel'),
    defaultValue: 'post',
  },
}, {
  tableName: 'posts',
  timestamps: true,
});

module.exports = Post;
