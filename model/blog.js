const {Schema , model} = require('mongoose');
const { create } = require('./user');

const blogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    coverImgUrl:{
        type: String,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true})

const Blog = model('blog',blogSchema)

module.exports = Blog ;