const express = require("express")

const router = express.Router()

const {registerController}= require("../controllers/Auth.Controller")


router.post("/register",registerController)


module.exports = router

