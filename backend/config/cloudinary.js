const cloudinary = require("cloudinary").v2;
const configs = require("./globals");

// Configure Cloudinary using values from globals.js
cloudinary.config({
  cloud_name: configs.Cloudinary.CloudName,
  api_key: configs.Cloudinary.ApiKey,
  api_secret: configs.Cloudinary.ApiSecret
});

module.exports = cloudinary;