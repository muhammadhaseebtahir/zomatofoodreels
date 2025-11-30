const express = require("express")

const router = express.Router()

const {registerController,verifyOtpController,resendOtpController,loginController,forgotPasswordController}= require("../controllers/Auth.Controller")


router.post("/user/register",registerController)
router.post("/user/verify-Otp",verifyOtpController)
router.post("/user/resend-Otp",resendOtpController)
router.post("/user/login",loginController)
router.put("/user/forgot-password",forgotPasswordController)


module.exports = router

