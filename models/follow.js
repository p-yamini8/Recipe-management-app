// models/Follow.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');

const Follow = sequelize.define('Follow', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }
});

User.belongsToMany(User, { through: Follow, as: 'followers', foreignKey: 'followedId' });
User.belongsToMany(User, { through: Follow, as: 'following', foreignKey: 'followerId' });

module.exports = Follow;