const jwt=require('jsonwebtoken');
const dotenv=require('dotenv')
dotenv.config();
const User=require('../models/user')

exports.authenticate=async(req,res,next)=>{
    try{
// const token= req.header('Authorization');
 const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token missing or malformed' });
        }

        // Extract the token by removing 'Bearer ' prefix
        const token = authHeader.split(' ')[1];
const decoded=jwt.verify(token,process.env.JWT_SECRET);

const user=await User.findByPk(decoded.id);
if(!user)
{
    return res.status(404).json({message:'user not found'});
}
req.user={id:decoded.id,name:decoded.name};
next()
    }
catch(err)
{console.log(err)
     // Optional: more specific error handling
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }

    return res.status(401).json({message:'authorization failed'});
}
}
