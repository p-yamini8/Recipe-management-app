// models/Review.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Recipe = require('./recipe');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  rating: { type: DataTypes.INTEGER, allowNull: false,defaultValue:5}, // 1–5
  comment: { type: DataTypes.TEXT }
});


module.exports = Review;