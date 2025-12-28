# Small App to upload images - Node + MongoDB + Cloudinary

Link live site: 

## Steps

1 - Create a free account in Cloudinary in https://cloudinary.com

2 - Take note of the API values

3 - Have ready a MongoDB connection string and connect it

4 - Run in terminal:

    npx express-generator --view=hbs

5 - Update the name an version in package.json, name must be lowercase: 'something-web-api' and the version should de 1.0.0

6 - Run in terminal:

    npm install

    npm audit fix --force

7 - Create the env file and store the connection string

8 - Run in terminal:

    npm install mongoose 

    npm install dotenv

9 - Run in terminal : nodemon and open in browser http://localhost:3000/  and verify that works. Then finish by Ctrl + C in terminal

10 - Create the folders routes > api    - > file images.js (plural)  *routes folder already exists, and images because the object is a Image
[if you need help use the explorer]

11 - Create the folders config > globals.js, and paste this:

    require("dotenv").config();
    //Global configuration objects 
    const configurations = {
        ConnectionStrings: {
        MongoDB: process.env.CONNECTION_STRINGS_MONGODB
        }

    };

    //Export the configurations objects for use in other modules
    module.exports= configurations;

12 - Open and add in  app.js before the line with 'var app = express();'

    // Import global configurations and mongoose
    var configs = require('./config/globals');
    var mongoose = require("mongoose");

13 - and before the line with '// catch 404 and forward to error handler' 

    //connect to MongoDB
    mongoose
    .connect(configs.ConnectionStrings.MongoDB)
    .then(()=> console.log("Connected successfully!!"))
    .catch((error)=>console.error("Error connecting to MongoDB",error));

14 - and after the line with 'var usersRouter = require('./routes/users');'

    var imagesAPIRouter = require('./routes/api/images');

15 - and before the line '//connect to MongoDB'

    app.use('/api/images', imagesAPIRouter); // adding my router

16 - Create the folder models, inside create image.js (singular)

inside, paste this

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

17 - Run in terminal:

    npm install cloudinary multer

18 - Add to the env file the values of Cloud name, API key, API secret  from Cloudinary

19 - Update the globals.js file to:

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

20 - Create inside config folder a cloudinary.js file and paste this inside

    const cloudinary = require("cloudinary").v2;
    const configs = require("./globals");

    // Configure Cloudinary using values from globals.js
    cloudinary.config({
        cloud_name: configs.Cloudinary.CloudName,
        api_key: configs.Cloudinary.ApiKey,
        api_secret: configs.Cloudinary.ApiSecret
    });

    module.exports = cloudinary;


21 - Create inside config folder a multer.js file and paste this inside

    const multer = require("multer");

    // Use memory storage (best for Cloudinary uploads)
    const storage = multer.memoryStorage();

    const upload = multer({
         storage: storage,
         limits: {
         fileSize: 5 * 1024 * 1024 // 5MB max file size
        }
    });

    module.exports = upload;

22 - Complete the post api endpoint in routes > api > images.js pasting this inside:

    const express = require("express");
    const router = express.Router();

    const upload = require("../../config/multer");
    const cloudinary = require("../../config/cloudinary");
    const Image = require("../../models/image");

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

23 - Test using insomnia. Have ready an image. 

Add in POST - Body - Multipart, and in one line type:

        image         [select file (e.g cat.jpg)]


24 - This is the complete backend of our project. We can stop here or continue and implement a frontend

25 - Close the project, create 2 folders inside the main folder called 'backend' and 'frontend'. Copy all the work done inside backend except these two:
* node_modules folder
* README.md file

26 - Delete the node_modules folder, this is necessary because when you move your project folder, some modules may reference old paths, causing errors that are hard to debug.
Deleting node_modules and running npm install ensures:

* Dependencies match exactly what’s listed in package.json

* No leftover artifacts from previous folder

* Anyone else cloning your repo can do npm install and it works

27 - Open again the folder project, now it has 2 folders (backend, frontend and README.md). In terminal enter

    cd .\backend\   
    npm install
    npm install cors
    nodemon

Open in a browser http://localhost:3000/  and verify that everything works, then close it with Ctrl + C

28 - Open a new terminal and enter

    cd .\frontend\   
    npx create-react-app .
    (answer y)
    npm install axios
    npm start

Open in a browser http://localhost:3000/  and verify that everything works

29 - Replace the content of App.css with this

    .container {
    padding: 20px;
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: auto;
    }

    h2 {
    color: #333;
    }

    input[type="file"] {
    margin-right: 10px;
    }

    button {
    padding: 6px 12px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    }

    button:hover {
    background-color: #45a049;
    }

    img {
    border-radius: 8px;
    box-shadow: 2px 2px 6px #aaa;
    margin: 10px;
    }

30 - Update App.js with this

    import { useEffect, useState } from "react";
    import axios from "axios";
    import "./App.css";

    function App() {
    const [image, setImage] = useState(null);
    const [images, setImages] = useState([]);

    const API_URL = "http://localhost:3000/api/images"; // change port if needed

    // Load images from backend
    const loadImages = async () => {
        try {
        const res = await axios.get(API_URL);
        setImages(res.data);
        } catch (err) {
        console.error("Failed to fetch images", err);
        }
    };

    useEffect(() => {
        loadImages();
    }, []);

    // Upload image to backend
    const uploadImage = async () => {
        if (!image) return;
        const formData = new FormData();
        formData.append("image", image);

        try {
        await axios.post(API_URL, formData);
        setImage(null);
        document.getElementById("fileInput").value = "";
        loadImages(); // reload images
        } catch (err) {
        console.error("Failed to upload image", err);
        }
    };

    return (
        <div className="container">
        <h2>Upload Image</h2>
        <input type="file" id="fileInput" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={uploadImage}>Upload</button>

        <hr />

        <h2>Gallery</h2>
        <div>
            {images.map((img) => (
            <img key={img._id} src={img.imageUrl} alt="" width="200" />
            ))}
        </div>
        </div>
    );
    }

    export default App;
    

32 - In backend > app.js add these lines, right below the line var app = express();

    var cors = require("cors");
    app.use(cors());

33 - Modify in frontend folder > package.json the following line:

    start": "set PORT=5000 && react-scripts start",

34 - Test the app running npm start in frontend and nodemon in backend. Verify it works

35 - Prepare the folder before pushing to GitHub. Delete the node_modules folder from each backend and frontend

36 - In terminal, inside the root project folder enter to create a package.json:

    npm init -y

37 - Make sure that the root package.json has:

        "scripts": {
            "install-all": "npm install --prefix backend && npm install --prefix frontend",
            "build": "npm run build --prefix frontend",
            "start": "node backend/bin/www"
        },
        "engines": {
        "node": "18.x"
        },

38 - Update the backend > app.js code, adding:

        // Serve React frontend
        const frontendBuildPath = path.join(__dirname, "../frontend/build");
        app.use(express.static(frontendBuildPath));

        // Catch-all: send React for any non-API route
        app.get("*", (req, res) => {
        res.sendFile(path.join(frontendBuildPath, "index.html"));
        });

39 - Update the frontend > src > App.js code, updating:

        const API_URL = "/api/images";


40 - Push your files to a public Repo in GitHub, using GitHub Desktop

41 - Deploy it using Render.