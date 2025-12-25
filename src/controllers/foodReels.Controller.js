const foodModel = require("../models/foodReels.Model");

const foodAddController = async (req, res) => {
  try {
    let  reelData = JSON.parse(req.body.postData);
    // let { description } = req.body;
    let {description} =reelData
    if ( !description) {
      return res
        .status(400)
        .json({ status: "Error", message: "All fields are required." });
    }
    if (!req.file) {
      return res
      .status(400)
      .json({ status: "Error", message: "No video file uploaded" });
    }
    const fileType = req.file.mimetype.startsWith("video/")? "video" : "image"

    const videoData = {
      url: req.file.path,
      public_id: req.file.filename,
    };

    const reelAdd = await foodModel.create({
     postType:fileType,
      description,
      mediaUrl: videoData,
      userDetails: req._id,
    });

    res
      .status(200)
      .json({ status: "Success", message: `${fileType} uploaded successfully`, reelAdd });
  } catch (err) {
    console.log(`Server Error ${err.message}`);
    res
      .status(500)
      .json({
        status: "Error",
        message: "Server error During uploading.",
        error: err.message,
      });
  }
};

const getFoodItemsController=async(req,res)=>{
    const foodItems= await foodModel.find({})
    res.status(200).json({status:"Success",message:"Food items fetch successfully.",foodItems})
}
    





module.exports = { foodAddController,getFoodItemsController };
