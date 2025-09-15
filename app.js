const express=require('express');
const path= require('path');
const bodyparser=require('body-parser');

const app= express();
app.use(bodyparser.urlencoded({extended:true}));
app.listen(3000,()=>{
    console.log('running 3000')
})