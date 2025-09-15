const express=require('express');
const path= require('path');
const bodyparser=require('body-parser');
const cors=require('cors');
const helmet=require('helmet');
const app= express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'view')));
app.use(cors());
app.use(helmet());

app.use('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'view','signup',"signup.html"))
})
app.listen(3000,()=>{
    console.log('running 3000')
})