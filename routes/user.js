const express=require('express');
const router=express.Router();
const auth=require('../middleware/auth')
const userControllers=require('../controllers/user')
router.post("/signup",userControllers.signup);
router.post('/login',userControllers.login);
router.get('/',auth.authenticate,userControllers.getUsers)
module.exports=router;