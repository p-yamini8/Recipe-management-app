// const express=require('express');
// const app= express();
// const path= require('path');
// const bodyparser=require('body-parser');
// var cors=require('cors');
// const helmet=require('helmet');
// const https=require('https');
// const dotenv=require('dotenv');
// const compression=require('compression');
// const morgan=require('morgan');
// const fs=require('fs');



// app.use(bodyparser.urlencoded({extended:true}));
// app.use(express.static(path.join(__dirname,'view')));
// app.use(express.json());
// // app.use(express.static('view'))
// app.use(cors());
// app.use(helmet());
// app.use(compression());
// const accesslogstream=fs.createWriteStream(path.join(__dirname,'access.log'),{flag:'a'})
// const userRoutes=require('./routes/user')
// app.use('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'view','signup',"signup.html"))
// })
// app.use('/user',userRoutes);
// app.listen(3000,()=>{
//     console.log('running 3000')
// })

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


const userRoutes = require('./routes/user')
const recipeRoutes=require('./routes/recipes');
const favoriteRoutes=require('./routes/favorite');
// const reviewRoutes=require('./routes/review')
//middlewares
app.use(morgan('combined', { stream: accessLogStream }))
app.use(cors())
app.use(bodyParser.json())
app.use(helmet())
app.use(compression())

//routes
app.use('/user', userRoutes)
app.use('/recipes',recipeRoutes);
app.use('/favorite',favoriteRoutes);
// app.use('/review',reviewRoutes);




sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000)
    console.log('running 3000')
  })
  .catch((err) => {
    console.log(err)
  })
  module.exports=app;