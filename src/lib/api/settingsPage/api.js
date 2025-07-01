import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthToken = () => localStorage.getItem("simpld-auth-token");
const getHospitalId = () => localStorage.getItem("simpld-customerId");

// Function to handle refreshing token if expired
const refreshAuthToken = async () => {
  // I refresh logic
};

export const fetchHospitalData = async () => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/company/${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return fetchHospitalData();
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

export const updatePatientRegData = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/company/${hospitalId}`,
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
          return updatePatientRegData(req_body);
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

export const updateStartNumber = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/patient/updateSerialno1/${hospitalId}`,
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
          return updateStartNumber(req_body);
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

export const uploadLogoPic = async (formData) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/company/logoPicture/${hospitalId}`,
      formData,
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
          return uploadLogoPic(formData);
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

export const uploadSignPic = async (formData) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/company/signPicture/${hospitalId}`,
      formData,
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
          return uploadSignPic(formData);
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

export const fetchStartingNumber = async () => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/patient/getserialno?customerId=${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return fetchStartingNumber();
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

export const fetchLogoPic = async () => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/company/getLogoPic/${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    // Create an object URL for the Blob
    return URL.createObjectURL(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return fetchLogoPic();
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

export const fetchSignPic = async () => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/company/getSignPic/${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    // Create an object URL for the Blob
    return URL.createObjectURL(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return fetchSignPic();
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

export const FetchPreview1 = async () => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/bill/preview1/${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    // Create an object URL for the Blob
    return URL.createObjectURL(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return FetchPreview1();
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

export const deleteClinic = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/clinic/${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: req_body,
      }
    );

    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error deleting clinic:", error.message);
    return error;
  }
};
