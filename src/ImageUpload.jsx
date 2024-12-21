import React from "react";
import { useState, useEffect } from "react";
import supabase from "./supabaseClient";

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const uploadImage = async () => {
    const fileName = `${Date.now()}-${image.name}`;

    try {
      setIsLoading(true);
      const { data: imageData, error: uploadError } = await supabase.storage
        .from("demo-storage")
        .upload(fileName, image);

      if (uploadError) {
        console.log("SupabaseError uploading: ", uploadError);
        setIsLoading(false);
      }
      if (imageData) {
        console.log(imageData);

        const { data: publicUrlData } = supabase.storage
          .from("demo-storage")
          .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;
        if (publicUrl) {
          setImageUrl(publicUrl);
        }

        return publicUrl;
      }
    } catch (error) {
      console.log("Caught an error: ", error);
      setIsLoading(false)
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageChange} accept="image/*" />
      <button onClick={uploadImage}>Upload</button>

      
        <span className="image-preview">
          <img src={imageUrl} alt="" />
        </span>
    </div>
  );
}

export default ImageUpload;
