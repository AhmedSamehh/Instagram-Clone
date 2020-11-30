const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,   
    },
    url:{
        type:String,
        default:"https://res.cloudinary.com/se7az/image/upload/v1598530930/default_rbmwl7.png"
    },
    followers:[{
        type:ObjectId,
        ref:"User"
    }],
    following:[{
        type:ObjectId,
        ref:"User"
    }]
})

module.exports = mongoose.model("User", userSchema)
