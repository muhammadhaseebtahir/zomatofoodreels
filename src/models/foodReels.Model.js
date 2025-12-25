const mongoose= require("mongoose")
const {ObjectId} = mongoose.Schema.Types
const reelsScmema = new mongoose.Schema({
    postType:{
        type:String,
        trim: true,
        required:true
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    mediaUrl:{
    url: {type:String,required:true},
     public_id:{type:String,required:true},
    },
    userDetails:{
      type:ObjectId,
        ref:"user",
        required:true
      
    }
},{timestamps:true})

const foodModel= mongoose.model("reel",reelsScmema)
module.exports=foodModel