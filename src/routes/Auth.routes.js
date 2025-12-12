const express = require("express");

const router = express.Router();
const verifyToken = require("../middlewares/Auth.Middlewares");

const {
  registerController,
  verifyOtpController,
  resendOtpController,
  loginController,
  forgotPasswordController,
  getUserController,
  foodpartnerRegisterController,
} = require("../controllers/Auth.Controller");

router.post("/user/register", registerController);
router.post("/user/verify-Otp", verifyOtpController);
router.post("/user/resend-Otp", resendOtpController);
router.post("/user/login", loginController);
router.put("/user/forgot-password", forgotPasswordController);
router.get(
  "/user",
  verifyToken(["user", "admin", "superAdmin"]),
  getUserController
);
router.post("/food-partner/register", foodpartnerRegisterController);
module.exports = router;
