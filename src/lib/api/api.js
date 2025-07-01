import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthToken = () => localStorage.getItem("simpld-auth-token");

// Function to handle refreshing token if expired
const refreshAuthToken = async () => {
  // I refresh logic
};

export const fetchCustomers = async ({
  page,
  rowsPerPage,
  plan,
  status,
  sortExpiry,
  sort_wa,
  sort_sms,
  date,
  searchTerm,
  expiryDateStart,
  expiryDateEnd,
  city,
  filterState,
  variantFilter,
}) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const params = {
      page,
      pageSize: rowsPerPage,
      plan: plan == "All" ? "" : plan,
      status,
      sortExpiry,
      sort_wa,
      sort_sms,
      date: date ? date.toISOString().slice(0, 10) : undefined,
      search: searchTerm,
      expiryDate_start: expiryDateStart,
      expiryDate_end: expiryDateEnd,
      city,
      state: filterState,
      variant: variantFilter == "All" ? "" : variantFilter,
    };

    const response = await axios.get(`${API_BASE_URL}/api/clinic`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error("Authorization error, attempting to refresh token.");
        try {
          await refreshAuthToken();
          return fetchCustomers({ page, rowsPerPage, plan, date, searchTerm });
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
