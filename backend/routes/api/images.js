const express = require("express");
const router = express.Router();

const upload = require("../../config/multer");
const cloudinary = require("../../config/cloudinary");
const Image = require("../../models/image");



/*
router.post("/", upload.any(), (req, res) => {
  console.log(req.files); // list of received files
  res.send("Check console");
});
*/

// POST: upload image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    cloudinary.uploader.upload_stream(
      { folder: "cloudimongo-images" },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ error });
        }

        // save image data to MongoDB
        const newImage = new Image({
          imageUrl: result.secure_url,
          publicId: result.public_id
        });

        await newImage.save();

        res.status(201).json(newImage);
      }
    ).end(req.file.buffer);

  } catch (err) {
    res.status(500).json({ message: "Image upload failed", error: err });
  }
});


// GET: list all images
router.get("/", async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
});

module.exports = router;