// // models/Favorite.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../util/database');
// const User = require('./user');
// const Recipe = require('./recipe');

// const Favorite = sequelize.define('Favorite', {
//   id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//   RecipeId:{type:DataTypes.INTEGER,allowNull:false}

// });

// // User.belongsToMany(Recipe, { through: Favorite, as: 'favorites' });
// // Recipe.belongsToMany(User, { through: Favorite, as: 'usersWhoFavorited' });
//  Favorite.associate = (models) => {
//         Favorite.belongsTo(models.User, { foreignKey: 'userId' });
//         Favorite.belongsTo(models.Recipe, { foreignKey: 'recipeId' }); // ✅ This is the key part
//     };
// module.exports = Favorite;


// models/Favorite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../util/database');
const User = require('./user');
const Recipe = require('./recipe');

const Favorite = sequelize.define('Favorite', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  UserId: { type: DataTypes.INTEGER, allowNull: false },
  RecipeId: { type: DataTypes.INTEGER, allowNull: false }
});

// Associations
Favorite.belongsTo(User, { foreignKey: 'UserId' });
Favorite.belongsTo(Recipe, { foreignKey: 'RecipeId' });

User.hasMany(Favorite, { foreignKey: 'UserId' });
Recipe.hasMany(Favorite, { foreignKey: 'RecipeId' });

module.exports = Favorite;