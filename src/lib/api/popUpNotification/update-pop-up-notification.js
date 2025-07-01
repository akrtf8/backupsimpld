import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthToken = () => localStorage.getItem("simpld-auth-token");

const refreshAuthToken = async () => {
  // Implement token refresh logic here if needed
};

export const updatePopUpList = async (data) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/clinic/popup`,
      {
        ...data,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return updatePopUpList(data);
        } catch (refreshError) {
          console.log("Token refresh failed:", refreshError);
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        console.log("API error:", error.response?.statusText);
        throw new Error(
          error.response?.data?.message || "Error updating intra-oral list"
        );
      }
    } else {
      console.log("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const updatePopUpImage = async (file) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("file", file);

    // Send the PUT request
    const response = await axios.put(
      `${API_BASE_URL}/api/clinic/popup/images`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", 
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return updatePopUpImage(file); // Retry with refreshed token
        } catch (refreshError) {
          console.log("Token refresh failed:", refreshError);
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        console.log("API error:", error.response?.statusText);
        throw new Error(
          error.response?.data?.message || "Error updating popup image"
        );
      }
    } else {
      console.log("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
