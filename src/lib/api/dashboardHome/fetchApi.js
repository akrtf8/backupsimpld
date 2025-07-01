import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthToken = () => localStorage.getItem("simpld-auth-token");

// Function to handle refreshing token if expired
const refreshAuthToken = async () => {
  // I refresh logic
};

export const fetchHomePageCount = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(`${API_BASE_URL}/api/clinic/dashboard`, {
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
          return fetchHomePageCount();
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

export const fetchSubscriptionsExpiring = async (params) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const { plan, dateRange } = params;

    const response = await axios.get(
      `${API_BASE_URL}/api/graph/barchart_subExpiry?plan_name=${plan}&year=${dateRange}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        // try {
        //   await refreshAuthToken();
        //   return fetchHomePageCount();
        // } catch (refreshError) {
        //   console.error("Token refresh failed:", refreshError);
        //   throw new Error("Session expired. Please log in again.");
        // }
        throw new Error("Session expired. Please log in again.");
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

export const fetchPieChart = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/graph/pieChart_variant`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        // try {
        //   await refreshAuthToken();
        //   return fetchHomePageCount();
        // } catch (refreshError) {
        //   console.error("Token refresh failed:", refreshError);
        //   throw new Error("Session expired. Please log in again.");
        // }
        throw new Error("Session expired. Please log in again.");
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

export const fetchTableLocation = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.get(
      `${API_BASE_URL}/api/graph/table_location`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        // try {
        //   await refreshAuthToken();
        //   return fetchHomePageCount();
        // } catch (refreshError) {
        //   console.error("Token refresh failed:", refreshError);
        //   throw new Error("Session expired. Please log in again.");
        // }
        throw new Error("Session expired. Please log in again.");
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

export const fetchCSVData = async (params) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const { type, from_date, to_date } = params;

    const response = await axios.get(
      `${API_BASE_URL}/api/finance/report?type=${type}&startDate=${from_date}&endDate=${to_date}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Ensure the response is treated as a binary blob
      }
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        // try {
        //   await refreshAuthToken();
        //   return fetchHomePageCount();
        // } catch (refreshError) {
        //   console.error("Token refresh failed:", refreshError);
        //   throw new Error("Session expired. Please log in again.");
        // }
        throw new Error("Session expired. Please log in again.");
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
