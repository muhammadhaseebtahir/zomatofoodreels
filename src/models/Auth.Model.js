const mongoose = require("mongoose")

const userSchema =new mongoose.Schema({
  userId:{
    type:String,
    trim:true,
    required:true
  },
  userName:{
  type:String,
  required:true,
  trim:true,
  minlength:[3,"UserName must bee greater then 3 character."],
  lowercase:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
        validate:{
            validator:(v)=>{
                 return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
            },
            message:(props)=> `${props.value} is not a valid email!`,
        }
    },
    password:{
        type:String,
        trim:true,
        validate:{
            validator:(v)=>{
                       return /[!@#$%^&*(),.?":{}|<>]/.test(v); 
            }, 
             message: "Password must contain at least one special character."
        }
    },
    status:{
        type:String,
        default:"inActive"
    },
    otp:{
        type:String,
        trim:true
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin","superAdmin"],   
    },
    imageUrl:{
        type:String,
        trim:true,
    },
    expiresAt:{
        type:Number,
        
    }

},{timestamps:true})



const userModel = mongoose.model("user",userSchema)


module.exports =userModel