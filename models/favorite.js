
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Favorite = sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  RecipeId: { type: DataTypes.INTEGER, allowNull: false }
});


module.exports = Favorite;