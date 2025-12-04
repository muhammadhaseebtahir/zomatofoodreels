const foodModel = require("../models/foodReels.Model");

const foodAddController = async (req, res) => {
  try {
    // const reelData = JSON.parse(req.body.product);
    let { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ status: "Error", message: "All fields are required." });
    }
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "Error", message: "No video file uploaded" });
    }

    const videoData = {
      url: req.file.path,
      public_id: req.file.filename,
    };

    const reelAdd = await foodModel.create({
      title,
      description,
      video: videoData,
      userDetails: req._id,
    });

    res
      .status(201)
      .json({ status: "Success", message: "Successfuly added.", reelAdd });
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
