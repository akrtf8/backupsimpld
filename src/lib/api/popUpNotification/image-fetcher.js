import React, { useEffect, useState } from "react";

const ImageFetcher = (imageFile) => {
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      let token = localStorage.getItem("simpld-auth-token");

      if (!imageFile || !token) return;
      
      try {
        const response = await fetch(
          `${baseURL}/api/clinic/popup/images?file=${imageFile}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();

    // Cleanup object URL on component unmount
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageFile]);

  return imageUrl;
};

export default ImageFetcher;
