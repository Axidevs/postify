const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/postify")

let userSchema = mongoose.Schema({
  username:String,
  age:Number,
  name:String,
  email:String,
  password:String,
  post:[{
    type:mongoose.Schema.ObjectId , ref:"post"
  }],
  profilepic:{
    type:String,
    default:"default.png"
  }

})

module.exports = mongoose.model("user",userSchema)
