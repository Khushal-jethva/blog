const express = require('express')
const mongoose = require('mongoose')
const userroute = require('./route/user')
const Blog = require('./model/blog')
const blogroute = require('./route/blog')
const cookieParser = require('cookie-parser')
const {checkForAuthenticationCookie} = require('./middleware/auth')
const app = express()
const port = 7000 
const path = require('path')

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then((e)=>console.log('md is connected'))

// middleware 
app.use(express.urlencoded({ extended: false}))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public/')))

app.set('view engine','ejs')
app.set('views',path.resolve('./views'))

app.get('/', async (req,res)=>{
    const blogs = await Blog.find({})
    res.render('home',{
        user: req.user,
        blogs : blogs
    })
})
app.use('/user',userroute)
app.use('/blog',blogroute)

app.listen(port ,()=>console.log(`port started at ${port}`))