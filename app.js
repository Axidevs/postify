const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const userModel = require('./models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(cookieParser())


app.get('/',(req,res)=>{
  res.render('index')
})

app.get('/login',(req,res)=>{
  res.render('login')
})

app.post('/register',async(req,res)=>{
  let {username ,name ,age,email,password} = req.body;
  let user = await userModel.findOne({email});
  if(user) return res.status(300).send("User already registered");
  bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(password ,salt , async (err , hash)=>{
     let user = await userModel.create({
      email,
      password:hash,
      username,
      age,
     })
     let token = jwt.sign({email :email , userid: user._id},"shhh")
     res.cookie("token" , token);
     res.send("regesitered")
    })
  })
})

app.post('/login',async(req,res)=>{
  let {email,password} = req.body;
  let user = await userModel.findOne({email});
  if(!user) return res.status(500).send("Something went wrong");
  
})


app.listen(3000 ,()=>{
  console.log("it is running")
})