const {DataTypes}=require('sequelize');
const sequelize=require('../util/database')

const User=sequelize.define('User',{
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
        isAdmin:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        },
        banned:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        },
})



module.exports=User;