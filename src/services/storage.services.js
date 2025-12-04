const cloudinary= require("cloudinary").v2
const {CloudinaryStorage}= require("multer-storage-cloudinary")
const multer = require("multer")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})
const storage= new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
          folder: "zomatoreels",
            resource_type: "video",
            //   public_id: (req, file) => Date.now() + "-" + file.originalname
    },
})


// const upload = multer({storage:storage})
const upload = multer({
    storage: storage,
    limits: {
    fileSize: 100 * 1024 * 1024   // ✅ 50 MB max
  } 
   
}); 

module.exports= {upload,cloudinary}



// require('dotenv').config(); // 👈 Add this at the top
// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// // ✅ Use environment variables
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: "zomatoreels",
//         resource_type: "video", // ✅ Specify it's for videos
//         allowed_formats: ["mp4", "mov", "avi", "mkv"], // ✅ Only video formats
//     },
// });

// // ✅ Add file size limit and validation
// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 100 * 1024 * 1024, // 100MB max
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.startsWith('video/')) {
//             cb(null, true);
//         } else {
//             cb(new Error('Only video files are allowed!'), false);
//         }
//     }
// });

// module.exports = { upload, cloudinary };