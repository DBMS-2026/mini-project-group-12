const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SavedPost = sequelize.define('SavedPost', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'posts',
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'saved_posts',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['postId', 'userId'],
    },
  ],
});

module.exports = SavedPost;
