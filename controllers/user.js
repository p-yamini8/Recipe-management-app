
const User=require('../models/user')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken')
require('dotenv').config()
exports.signup=async(req,res)=>{
    try{
       
const {name,email,number,password}=req.body;
if(!name||!email||!password||!number)
{
    return res.status(400).json({message:'Enter all details'});
}console.log(name)
const existingUser=await User.findOne({where:{email}});
if(existingUser)
{
    return res.status(400).json({message:'user already exists'})
}
const hash=await bcrypt.hash(password,10);
console.log(name,email,number,password)
const user=await User.create({name,email,number,password:hash});
console.log(user)
return res.status(201).json({message:'user signup success'});

    }
catch(err)
{
    console.log('signup err:',err)
    return  res.status(500).json({message:'error signup'});

}
}
exports.login=async(req,res)=>{
    const {email,password}=req.body;
    console.log(email,password)
    if(!email||!password)
    {
        return res.status(400).json({message:"missing fields"});

    }
    try{
        const user=await User.findOne({where:{email}});
        if(!user||!(await bcrypt.compare(password,user.password)))
        {
            return res.status(401).json({message:'invalid credentials'});
        }
        const token=await jwt.sign({id:user.id,
            name:user.name,
            email:user.email,
            password:user.password
        },process.env.JWT_SECRET);
        
        res.json({message:'login success',token,name:user.name});
    }
    catch(err)
    {
        return res.status(500).json({message:err.message})
    }
}