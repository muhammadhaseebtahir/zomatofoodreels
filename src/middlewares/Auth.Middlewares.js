const jwt = require("jsonwebtoken");
const userModel = require("../models/Auth.Model");
// const verifyToken = (roles = [] )=>{
//  return  async(req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res
//       .status(401)
//       .json({ status: "Error", message: "Please login first." });
//   }

//   const token = authHeader.split(" ")[1];

//   jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, result) => {
//     if (!err) {
//       const getUser = await AuthModel.findOne(result._id);
//       if (getUser && getUser.status == "active" &&  roles.includes(getUser.role)) {
//         req._id = result._id;
//         next();
//       }
//     } else {
//       return res
//         .status(403)
//         .json({ status: "Error", message: "Invalid Token." });
//     }
//   });
// }
// }

const verifyToken = (roles=[]) => {
   return async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Please login first." });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "Failed", message: "Token missing." });
  }
  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, result) => {
    if (err) {
      return res
        .status(403)
        .json({ status: "Error", message: "Invalid or expired token" });
    }
    const user = await userModel.findById(result._id).select("-password");
    if (!roles.includes(user.role)) {
      return res.status(403).json({
        message: "You are not allowed to access this route",
      });
    }
    req._id = result._id;
    next();
  })
}
};

module.exports = verifyToken;
