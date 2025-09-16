
const User=require('../models/user')
const bcrypt=require('bcrypt');
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