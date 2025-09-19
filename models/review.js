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

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

Recipe.hasMany(Review, { foreignKey: 'recipeId' });
Review.belongsTo(Recipe, { foreignKey: 'recipeId' });

module.exports = Review;