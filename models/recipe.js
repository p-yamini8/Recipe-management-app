// models/Recipe.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const Recipe = sequelize.define('Recipe', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  ingredients: { type: DataTypes.TEXT, allowNull: false },
  instructions: { type: DataTypes.TEXT, allowNull: false },
  cookingTime: { type: DataTypes.INTEGER },
  servings: { type: DataTypes.INTEGER },
  category: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.STRING },
  imageUrl: { type: DataTypes.STRING }
});

User.hasMany(Recipe, { foreignKey: 'userId' });
Recipe.belongsTo(User, { foreignKey: 'userId' });

module.exports = Recipe;