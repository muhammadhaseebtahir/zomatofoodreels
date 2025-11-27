const mongoose = require("mongoose")
require("dotenv").config()
const dbConnected =()=>{
    mongoose.connect(process.env.MONGO_URL,{
        dbName:"ZomatoApp"
    }).then(()=>{
        console.log("Mongo db connected Successfully.")
    }).catch((err)=>{
        console.log(`connection error ${err}`)
    })
}


module.exports= dbConnected