const jwt= require("jsonwebtoken")

const verifyToken=(req,res,next)=>{
    const authHeader= req.headers.authorization
if(!authHeader){
    return res.status(401).json({status:"Error",message:"Please login first."})
}

    const token = authHeader.split(" ")[1]
    const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY)
 jwt.verify(token,process.env.JWT_SECRET_KEY,(err,result)=>{
    if(!err){
        req._id= result._id
next()
    }else{
        return res.status(403).json({status:"Error",message:"Invalid Token."})
    }

 })


}

module.exports= verifyToken