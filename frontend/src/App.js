import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);

  const API_URL = "/api/images"; // change port if needed

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