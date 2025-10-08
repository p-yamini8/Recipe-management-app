
const express = require('express')
const app = express()
var cors = require('cors')
const path = require('path')
const bodyParser = require('body-parser')

const jwt = require('jsonwebtoken')
const compression = require('compression')
const helmet = require('helmet')
const morgan = require('morgan')
const fs = require('fs')
const https = require('https')
const dotenv = require('dotenv')
app.use(express.static(path.join(__dirname,'view')));
app.use(express.json());
dotenv.config()
app.use(bodyParser.urlencoded({extended:true}))
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flag: 'a' })
app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname,'view','signup',"signup.html"))
})

const sequelize = require('./util/database')
const User = require('./models/user')
const Recipe=require('./models/recipe')
const Review=require('./models/review');
const Follow = require("./models/follow");
const Favorite=require('./models/favorite')
const userRoutes = require('./routes/user')
const recipeRoutes=require('./routes/recipes');
const favoriteRoutes=require('./routes/favorite');
const reviewRoutes=require('./routes/review')
const profileRoutes = require("./routes/profile");
const feedRoutes = require("./routes/feed");
const followRoutes=require('./routes/follow')
// const adminRoutes = require("./routes/admin");


//middlewares
app.use(morgan('combined', { stream: accessLogStream }))
app.use(cors())
app.use(bodyParser.json())
app.use(helmet())
app.use(compression())



// ====== ASSOCIATIONS ======

User.hasMany(Recipe, { as: 'Recipes', foreignKey: 'userId' });
Recipe.belongsTo(User, { as: 'User', foreignKey: 'userId' });

// Reviews
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Recipe.hasMany(Review, { foreignKey: 'recipeId' });
Review.belongsTo(Recipe, { foreignKey: 'recipeId' });

// Favorites
Favorite.belongsTo(User, { foreignKey: 'UserId' });
Favorite.belongsTo(Recipe, { foreignKey: 'RecipeId' });
User.hasMany(Favorite, { foreignKey: 'UserId' });
Recipe.hasMany(Favorite, { foreignKey: 'RecipeId' });

// Follows
User.belongsToMany(User, {
  through: Follow,
  as: 'Followers',
  foreignKey: 'followingId'
});

User.belongsToMany(User, {
  through: Follow,
  as: 'Following',
  foreignKey: 'followerId'
});

Follow.belongsTo(User, { as: 'FollowerUser', foreignKey: 'followerId' });
Follow.belongsTo(User, { as: 'FollowingUser', foreignKey: 'followingId' });
//routes
app.use('/user', userRoutes)
app.use('/recipes',recipeRoutes);
app.use('/favorite',favoriteRoutes);
app.use('/review',reviewRoutes);
app.use('/follow',followRoutes)
app.use("/profile", profileRoutes);
app.use('/feed',feedRoutes);
// app.use('/admin',adminRoutes)
sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000)
    console.log('running 3000')
  })
  .catch((err) => {
    console.log(err)
  })
  module.exports=app;