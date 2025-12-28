// Naming conventions: models are singular, routers are plural
const mongoose = require("mongoose");

// define data schema object in JSON
const dataSchemaObject = {
    imageUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
 
};

// create mongoose schema
let mongooseSchema = new mongoose.Schema(dataSchemaObject);

// create and export mongoose model
module.exports = mongoose.model("Image",mongooseSchema);