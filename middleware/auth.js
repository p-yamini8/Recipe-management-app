const jwt=require('jsonwebtoken');
require('dotenv').config();
const User=require('../models/user')

exports.authenticate=async(req,res)=>{
    try{
const token= req.header('Authorization');

const decoded=jwt.verify(token,process.env.JWT_SECRET);
const user=await User.findByPk(decoded.id);
if(!user)
{
    return res.status(404).json({message:'user not found'});
}
req.user=User;
next()
    }
catch(err)
{
    return res.status(401).json({message:'authorizatio failed'});
}
}
