const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  cuisine: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true,
    defaultValue: 0.0,
  },
  averageCost: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  openingTime: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  mapLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'restaurants',
  timestamps: true,
});

module.exports = Restaurant;
