const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Follower = sequelize.define('Follower', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'User who is following',
  },
  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'User who is being followed',
  },
}, {
  tableName: 'followers',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['followerId', 'followingId'] },
    { fields: ['followerId'] },
    { fields: ['followingId'] },
  ],
});

module.exports = Follower;
