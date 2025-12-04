const express = require("express")
const cors= require("cors")
const app = express()
const dbConnected= require("./src/config/db")
const bodyParser = require("body-parser")
const userModel = require("./src/models/Auth.Model")

const Auth = require("./src/routes/Auth.routes")
const reels= require("./src/routes/foodreels.route")


dbConnected()
require("dotenv").config()
app.use(cors())
app.use(bodyParser.json())


app.get("/",(req,res)=>{
    res.send("HEllo how and i am good and  how are.")
})

const PORT = process.env.PORT || 8000

setInterval(async()=>{
    try{
    const oneHourAgo = new Date(Date.now()- 60 * 60 * 1000)
    const result = await userModel.deleteMany({
        status:"inActive",
        expiresAt:{$lt :oneHourAgo }
    })
    console.log(`Cleaned up ${result.deletedCount} inactive user.`)
    }catch(err){
console.error('Cleanup error:', err);
    }

}, 60 * 60 * 1000)



app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`)
})



app.use("/auth",Auth)
app.use("/add",reels)