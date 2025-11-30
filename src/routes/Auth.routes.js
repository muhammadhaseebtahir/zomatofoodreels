const express = require("express")

const router = express.Router()

const {registerController,verifyOtpController}= require("../controllers/Auth.Controller")


router.post("/user/register",registerController)
router.post("/user/verify-Otp",verifyOtpController)


module.exports = router

