const {Schema , model} = require('mongoose');

const commentSchema = new Schema({
    content : {
        type:String,
        require:true,
    },
    blogid:{
        type:Schema.Types.ObjectId,
        ref:'blog'
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
},{timestamps:true})

const Comment = model('comment',commentSchema)

module.exports = Comment ;