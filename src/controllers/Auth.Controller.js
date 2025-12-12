const userModel = require("../models/Auth.Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendEmail = require("../config/nodeMailer");
const randomId = () =>
  Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

const otpGenrator = () => Math.floor(1000 + Math.random() * 900000).toString();

// const otpStore = new Map();

const registerController = async (req, res) => {
  try {
    const { email, userName, password } = req.body;

    if (!email || !userName || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill al the inputs." });
    }
    const isUserAlreadyExist = await userModel.findOne({ email });
    if (isUserAlreadyExist) {
      return res
        .status(409)
        .json({
          success: false,
          message: "User already exists with this email.",
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const otp = otpGenrator();

    const user = await userModel.create({
      userId: randomId(),
      userName,
      email,
      password: hashPassword,
      otp,
      status: "inActive",
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    //  otpStore.set(email,{
    //   userName,
    //   email,
    //   password:hashPassword,
    //   otp,
    //   otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)

    //  })

    // Send OTP via email
    const emailResult = await sendEmail(
      email,
      `Your verification OTP is: ${otp}. Valid for 10 minutes.`
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: emailResult.error,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "OTP send to your email.Please verify to comlpete you registration.",
    });
  } catch (err) {
    console.log(`register error ${err}`);
    return res.status(500).json({
      success: false,
      message: "Server error during registration.",
      error: err.message,
    });
  }
};

const verifyOtpController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    let storedOtp = await userModel.findOne({ email });
    if (!storedOtp) {
      return res.status(404).json({
        success: false,
        message: "No registration found. Please register first.",
      });
    }

    if (new Date(Date.now()) > storedOtp.otpExpiresAt) {
      storedOtp.otp = null;
      await storedOtp.save();

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP.",
        action: "resend_OTP",
      });
    }

    if (storedOtp.otp != otp) {
      return res.status(400).json({ status: "Error", message: "Invalid OTP." });
    }

    const token = jwt.sign({ _id: storedOtp._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    storedOtp.status = "active";
    await storedOtp.save();

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      token: token,
    });
  } catch (err) {
    console.log(`OTP verification error: ${err}`);
    res.status(500).json({
      status: "error",
      message: "Server error during verification.",
      error: err.message,
    });
  }
};

const resendOtpController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "Error", message: "Email is required." });
    }
    let storedData = await userModel.findOne({ email });
    if (!storedData) {
      return res.status(404).json({
        status: "Error",
        message: "No registration found. Please register first.",
      });
    }
    const newOtp = otpGenrator();

    const emailResult = await sendEmail(
      email,
      `Your new verification OTP is: ${newOtp}. Valid for 10 minutes.`
    );
    if (!emailResult.success) {
      return res.status().json({
        status: "Error",
        message: "Failed to send OTP email",
        error: emailResult.error,
      });
    }

    storedData.otp = newOtp;
    storedData.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await storedData.save();
    return res
      .status(200)
      .json({ status: "Success", message: "New otp send to your Email." });
  } catch (err) {
    console.log(`resend Otp error ${err}`);
    return res.status(500).json({
      status: "Error",
      message: `Serever error during resend otp`,
      error: err.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter the all values." });
    }
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ status: "error", message: "Invalid email or passord" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ status: "error", message: "Inavalid email or password." });
    }
    if (existingUser.status == "inActive") {
      return res
        .status(401)
        .json({
          status: "error",
          message: "Your account is inactive. Please contact support.",
        });
    }
    const token = jwt.sign(
      { _id: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res
      .status(200)
      .json({ status: "success", message: "Login Successfuly.", token: token });
  } catch (err) {
    console.log(`login Error ${err.message}`);
    res
      .status(500)
      .json({
        status: "error",
        message: `Server error ${err.message}`,
        error: err.message,
      });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(401)
        .josn({
          status: "error",
          message: "please enter valid email or password.",
        });
    }
    if (existingUser.status == "inActive") {
      return res
        .status(401)
        .josn({
          status: "error",
          message: "please enter valid email or password.",
        });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashPassword;
    await existingUser.save();
    return res
      .status(200)
      .json({ status: "Success", message: "Password update Successfuly." });
  } catch (err) {
    console.log(`Server error ${err.message}`);
    return res
      .status(500)
      .json({
        status: "Error",
        message: "Server error during update password.",
        error: err.message,
      });
  }
};

const getUserController = async (req, res) => {
  const id = req._id;
  try {
    const getUser = await userModel.findById(id).select("-password");

    if (getUser) {
      return res
        .status(200)
        .json({ message: "User get Successfull", user: getUser });
    } else {
      return res.status(404).json({ message: "User Not found" });
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res
      .status(500)
      .json({ status: "Failed", message: "Server Error", error: err.message });
  }
};

// *******Food partner Controller *************

const foodpartnerRegisterController = async (req, res) => {
  try {
    const { email, userName, password, brandName, phoneNo, address } = req.body;
    if (
      !email ||
      !userName ||
      !password ||
      !brandName ||
      !phoneNo ||
      !address
    ) {
      return res
        .status(400)
        .json({ Status: "Failed", message: "All fields are required" });
    }
    const getUser = await userModel.findOne({ email }).select("-password");
    if (getUser) {
      return res
        .status(409)
        .json({
          status: "Failed",
          message: "User already exists with this email",
        });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const otp = otpGenrator();

    const newPartner = await userModel.create({
      userId: randomId(),
      userName,
      email,
      role:"admin",
      adminProfile: {
        brandName,
        phoneNo,
        address,
      },
      password: hashPassword,
      otp,
      status: "inActive",
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const emailResult = await sendEmail(
      email,
      `Your verification OTP is: ${otp}. Valid for 10 minutes.`
    );

 if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        error: emailResult.error,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "OTP send to your email.Please verify to comlpete you registration.",
    });


  } catch (err) {
    console.log("Foodpartner error", err.message);
    return res
      .status(500)
      .json({ status: "error", message: "server error", error: err.message });
  }
};

module.exports = {
  registerController,
  verifyOtpController,
  resendOtpController,
  loginController,
  forgotPasswordController,
  getUserController,
  foodpartnerRegisterController,
};
