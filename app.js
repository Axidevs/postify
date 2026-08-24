const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const userModel = require('./models/user')
const postModel = require('./models/post')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const upload = require('./config/multerconfig');
const crypto = require('crypto');

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname ,"public")))
app.set('view engine','ejs')
app.use(cookieParser())


app.get('/',(req,res)=>{
  res.render('index')
})

app.get('/profile/upload',(req,res)=>{
  res.render('profileupload')
})
app.post('/upload',isLoggedIn ,upload.single('image'),async(req,res)=>{
  let user = await userModel.findOne({email: req.user.email})
  user.profilepic = req.file.filename
  await user.save()
  res.redirect('/profile')

})




app.post('/update/:id',isLoggedIn,async (req,res)=>{
  let post = await postModel.findOneAndUpdate({_id:req.params.id},{content:req.body.content})
  res.redirect('/profile')
  
})

app.get('/like/:id',isLoggedIn ,async(req,res)=>{
  let post = await postModel.findOne({_id: req.params.id}).populate("user")

  if(post.likes.indexOf(req.user.userid)=== -1){
    post.likes.push(req.user.userid)
  }
  else{
    post.likes.splice("post.likes.indexOf(req.user.userid",1)
  }
  
  await post.save()
  res.redirect("/profile")
})
app.get('/edit/:id',isLoggedIn ,async(req,res)=>{
  let post = await postModel.findOne({_id: req.params.id}).populate("user")
  res.render('edit',{post})

})

app.post('/post',isLoggedIn , async(req,res)=>{
  let user = await userModel.findOne({email :req.user.email})
  let{content}= req.body
  let post = await postModel.create({
    
    userid:user._id,
    content:content
  })
  user.post.push(post._id);
  await user.save()
  res.redirect("/profile")

})



app.get('/profile',isLoggedIn ,async(req,res)=>{
let user = await userModel.findOne({email:req.user.email}).populate("post")
// console.log(user)
res.render('profile',{user})
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
  if(!user) return res.status(500).send("Something went wrong")
    bcrypt.compare(password , user.password ,function (err , result){
  if(result) {
    let token = jwt.sign({email :email , userid: user._id},"shhh")
     res.cookie("token" , token);

     res.status(200).redirect("/profile")

  }
    else res.redirect('/login')
  })
  
})

app.get('/logout',(req,res)=>{
 res.cookie("token" ,"");
 res.redirect('/login')
})

 function isLoggedIn(req,res ,next) {
if(req.cookies.token ==="") res.redirect('/login')
  else{
 let data = jwt.verify(req.cookies.token ,"shhh")
 req.user= data
next()
  }
  
 } 

app.listen(3000 ,()=>{
  console.log("it is running")
})