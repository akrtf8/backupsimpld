import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthToken = () => localStorage.getItem("simpld-auth-token");
const getHospitalId = () => localStorage.getItem("simpld-customerId");

// Function to handle refreshing token if expired
const refreshAuthToken = async () => {
  // I refresh logic
};

export const fetchInAppNotData = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${API_BASE_URL}/api/push_notification`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return fetchInAppNotData();
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        console.error("API error:", error.response?.statusText);
        throw new Error(
          error.response?.data?.message || "Error fetching customers"
        );
      }
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const addNotification = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/push_notification`,
      req_body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return addNotification(req_body);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          throw new Error("Session expired. Please log in again.");
        }
      } else {
        console.error("API error:", error.response?.statusText);
        throw new Error(
          error.response?.data?.message || "Error fetching customers"
        );
      }
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};
