const {Router} = require('express')
const User = require('../model/user') 
const router = Router()


router.get('/signin',(req,res)=>{
    return res.render('signin')
})

router.post('/signin', async (req,res)=>{
    const {email,password} = req.body
    try {
    const token =  await User.matchPasswordAndGenrateToken(email,password)
    console.log('token',token)
    res.cookie('token',token).redirect('/')
    } catch (error) {
        return res.render('signin',{error : 'incorrect passworn or email'})
    }
})

router.get('/signup',(req,res)=>{
    return res.render('signup')
})

router.post('/signup',async(req,res)=>{
    const {fullname,email,password} = req.body
    await User.create({
        fullname : fullname,
        email :email ,
        password : password
    })
    return res.redirect('/')
    
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})

module.exports = router