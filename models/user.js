const {DataTypes}=require('sequelize');
const sequelize=require('../util/database')

const Sequelize=sequelize.define('User',{
    id:{type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    name:{type:DataTypes.STRING,
        allowNull:false,

    },
    number:{type:DataTypes.STRING,
        allowNull:false,},
        email:{type:DataTypes.STRING,
    unique:true},
    password:{type:DataTypes.STRING,
        allowNull:false,},
})
module.exports=Sequelize;

