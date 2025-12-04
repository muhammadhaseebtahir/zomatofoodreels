const express =require("express")
const {cloudinary,upload} = require("../services/storage.services")
const verifyToken= require("../middlewares/Auth.Middlewares")
const {foodAddController}= require("../controllers/foodReels.Controller")
const router = express.Router()


router.post("/food-reels", upload.single("video"),verifyToken,foodAddController)


module.exports= router
