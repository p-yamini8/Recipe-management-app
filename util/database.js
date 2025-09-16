const Sequelize=require('sequelize');
const sequelize=new Sequelize('sakila','root','spypgr@123',{
    dialect:'mysql',
    host:'localhost'
})
module.exports=sequelize