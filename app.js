const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const userModel = require('./models/user')
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')





app.get('/',(req,res)=>{
  res.send('hey')
})


app.listen(3000 ,()=>{
  console.log("it is running")
})