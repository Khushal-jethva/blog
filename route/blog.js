const {Router} = require('express')
const Blog = require('../model/blog')
const Comment = require('../model/comments')
const path = require('path')
const fs = require('fs');
const multer = require('multer');

const router = Router()

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve(`./public/uploads/`))
//   },
//   filename: function (req, file, cb) {
//     const filename = `${Date.now()}-${file.originalname}`
//     cb(null, filename)
//   }
// })

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve('./public/uploads/');
    fs.mkdirSync(uploadPath, { recursive: true }); // Make sure folder exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

const upload = multer({ storage:storage })

router.get('/add-new',(req,res)=>{
    res.render('add_blog',{
        user:req.user
    })
})

router.post('/',upload.single('coverImgUrl'),async(req,res)=>{
    console.log(req.file)
    const {body,title} = req.body
    const blog = await Blog.create({
        body:body,
        title:title,
        createdBy : req.user._id,
        coverImgUrl:`/uploads/${req.file.filename}`
    })
    // res.redirect('/blog/:id')
    res.redirect('/')
})

router.get('/:id',async(req,res)=>{
  const blog = await Blog.findById(req.params.id).populate('createdBy') 
  const comments = await Comment.find({blogid:req.params.id}).populate('createdBy')
  
  return res.render('blog',{
    user : req.user,
    blog:blog,
    comments:comments
  })

})


router.post('/comment/:blogid',async(req,res)=>{
  await Comment.create({
    content:req.body.content,
    blogid:req.params.blogid,
    createdBy:req.user._id
  })
  res.redirect(`/blog/${req.params.blogid}`)
})

module.exports = router