const { error } = require('console');
const { createHmac , randomBytes} = require('crypto');
const {Schema , model} = require('mongoose');
const { createTokenForUser } = require('../services/authentication');

const userschema = new Schema({
    fullname :{
        type:String,
        required:true
    },
    email:{
        type :String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
        // require:true
    },
    password:{
        type :String,
        required:true,
        
    },
    profileImgUrl:{
        type:String,
        default :'/image/userimg.png'
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },

},
{timestamps:true}
);

userschema.pre("save",function(next){
    const user = this;

    if(!user.isModified('password')) return 

    const salt = randomBytes(16).toString();
    const hashedpassword = createHmac('sha256',salt)
    .update(user.password)
    .digest('hex')

    this.salt = salt
    this.password = hashedpassword
    next();
})


userschema.static('matchPasswordAndGenrateToken', async function(email,password){
const user =  await this.findOne({email})
if(!user) throw new error('email not found');

const salt = user.salt ;
const hashedPassword = user.password ;

const hashedpassword = createHmac('sha256',salt)
    .update(password)
    .digest('hex')

    if(hashedPassword !== hashedpassword) throw new error('incoorect password')
    const token = createTokenForUser(user)
    return token ; 
})

const User = model('User',userschema)

module.exports = User;