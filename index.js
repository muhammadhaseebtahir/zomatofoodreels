const express = require("express")
const cors= require("cors")
const app = express()
const dbConnected= require("./src/config/db")
const bodyParser = require("body-parser")


const Auth = require("./src/routes/Auth.routes")


dbConnected()
require("dotenv").config()
app.use(cors())
app.use(bodyParser.json())

app.get("/",(req,res)=>{
    res.send("HEllo how and i am good and  how are.")
})

const PORT = process.env.PORT || 8000




app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`)
})



app.use("/auth",Auth)