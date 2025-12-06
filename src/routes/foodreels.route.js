const express =require("express")
const {cloudinary,upload} = require("../services/storage.services")
const verifyToken = require("../middlewares/Auth.Middlewares")
const {foodAddController,getFoodItemsController}= require("../controllers/foodReels.Controller")
const router = express.Router()


router.post("/add/food-reels", upload.single("video"),verifyToken(["admin","superAdmin"]),foodAddController)
router.get("/reels",verifyToken(["user"]),verifyToken(["user","admin","superAdmin"]),getFoodItemsController)

module.exports= router
