require("dotenv").config();
//Global configuration objects 
const configurations = {
    ConnectionStrings: {
        MongoDB: process.env.CONNECTION_STRINGS_MONGODB
    },
    Cloudinary: {
    CloudName: process.env.CLOUDINARY_NAME,
    ApiKey: process.env.CLOUDINARY_API_KEY,
    ApiSecret: process.env.CLOUDINARY_API_SECRET
  }

};

//Export the configurations objects for use in other modules
module.exports= configurations;