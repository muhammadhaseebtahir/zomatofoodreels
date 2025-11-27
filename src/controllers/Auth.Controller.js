const userModel = require("../models/Auth.Model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const sendEmail =require("../config/nodeMailer")
const randomId = ()=> Math.random().toString(36).slice(2)+ Math.random().toString(36).slice(2)

const otpGenrator = ()=> Math.floor(1000  + Math.random()*900000).toString()


const registerController= async(req,res)=>{

   try{
  const {email,userName,password} = req.body

if(!email || !userName || !password){
   return  res.status(400).json({ success:false,message:"Please fill al the inputs."})
}
 const isUserAlreadyExist =await userModel.findOne({email})
 if(isUserAlreadyExist){
    return  res.status(400).json({success:false, message:"User Already exist."})
 }


 const hashPassword =await bcrypt.hash(password,10)

const otp= otpGenrator()
    
 const user =  await  userModel.create({
    userId:randomId(),
    userName,
    email,
    password:hashPassword,
    otp,
    status:"inactive",
    expiresAt:new Date(Date.now() + 10 * 60 * 1000) 
 })


 // Send OTP via email
const emailResult= await sendEmail(email, `Your verification OTP is: ${otp}. Valid for 10 minutes.`)

if(!emailResult.success){
    return res.status(500).json({
        success:false,
        message:"Failed to send OTP email",
        error:emailResult.error
    })


}

res.status(200).json({success:true,message:"OTP send to your email.Please verify to comlpete you registration."})

   }catch(err){
    console.log(`register error ${err}`)
    res.status(500).json({ success:false, message:"Server error during registration.", error: err.message,})
   }
}



// const verifyOtpController =async(req,res)=>{
// try{
//     const {email,otp}= req.body
//     if(!email ||!otp){
//         return res.status(400).json({success:false,message:"Email and OTP are required"})
//     }

//     const storedOtp = await userModel.findone({email})
//     if(!storedOtp){
//         return res.status(404).json({success:false,message:"No registration found. Please register first."})
//     }

//      if(Date.now > storedOtp.expiresAt){
//     return res.status(400).json({success:false,message:"OTP expired. Please request a new OTP."})

//      }  
     
     
//      if(storedOtp != otp){
//         return res.status()
//      }






// }catch(err){

// }

// }




module.exports= {
    registerController
}