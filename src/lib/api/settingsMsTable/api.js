import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthToken = () => localStorage.getItem("simpld-auth-token");
const getHospitalId = () => localStorage.getItem("simpld-customerId");

// Function to handle refreshing token if expired
const refreshAuthToken = async () => {
  // I refresh logic
};

// lab work api start ----------

export const fetchLabWork = async ({ searchTerm }) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const params = {
      search: searchTerm,
    };

    const response = await axios.get(
      `${API_BASE_URL}/api/lab_work_master?customerId=${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    return response.data;
  } catch (error) {
    return error;
    // if (axios.isAxiosError(error)) {
    //   if (error.response?.status === 401) {
    //     console.error("Authorization error, attempting to refresh token.");
    //     try {
    //       await refreshAuthToken();
    //       return fetchLabWork({ page, rowsPerPage, plan, date, searchTerm });
    //     } catch (refreshError) {
    //       console.error("Token refresh failed:", refreshError);
    //       throw new Error("Session expired. Please log in again.");
    //     }
    //   } else {
    //     console.error("API error:", error.response?.statusText);
    //     throw new Error(
    //       error.response?.data?.message || "Error fetching customers"
    //     );
    //   }
    // } else {
    //   console.error("Unexpected error:", error);
    //   throw new Error("An unexpected error occurred");
    // }
  }
};

export const updateLabWork = async (id, name) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/lab_work_master/${id}`,
      name,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const addLabWork = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      //   `${API_BASE_URL}/api/lab_work_master/${hospitalId}`,
      `${API_BASE_URL}/api/lab_work_master?customerId=${hospitalId}`,
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
    return error;
  }
};

export const deleteLabWork = async (id) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/lab_work_master/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

// lab work api end ----------

//  Admin Users api start ----------

export const fetchAdminUsers = async ({ searchTerm }) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const params = {
      search: searchTerm,
    };

    const response = await axios.get(
      `${API_BASE_URL}/api/users?customerId=${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateAdminUsers = async (id, body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(`${API_BASE_URL}/api/users/${id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const addAdminUsers = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    let body = {
      name: req_body.name,
      emailId: req_body.email,
      role1: req_body.role,
      password: req_body.password,
      confirm_password: req_body.confirmPassword,
      phoneNumber: req_body.mobile,
    };
    const response = await axios.post(
      //   `${API_BASE_URL}/api/users/${hospitalId}`,
      `${API_BASE_URL}/api/users?customerId=${hospitalId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteAdminUsers = async (id) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.delete(`${API_BASE_URL}/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

// Admin Users api end ----------

//  Doctors api start ----------

export const fetchDoctor = async ({ searchTerm }) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const params = {
      search: searchTerm,
    };

    const response = await axios.get(
      `${API_BASE_URL}/api/doctor_master?customerId=${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateDoctor = async (id, name) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/doctor_master/${id}`,
      name,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const addDoctor = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      //   `${API_BASE_URL}/api/doctor_master/${hospitalId}`,
      `${API_BASE_URL}/api/doctor_master?customerId=${hospitalId}`,
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
    return error;
  }
};

export const deleteDoctor = async (id) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/doctor_master/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

// Doctors api end ----------

//  Doctors api start ----------

export const fetchTreatments = async ({ searchTerm }) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const params = {
      search: searchTerm,
    };

    const response = await axios.get(
      `${API_BASE_URL}/api/treatment_master?customerId=${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateTreatments = async (id, name) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/treatment_master/${id}`,
      name,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const addTreatments = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      //   `${API_BASE_URL}/api/treatment_master/${hospitalId}`,
      `${API_BASE_URL}/api/treatment_master?customerId=${hospitalId}`,
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
    return error;
  }
};

export const deleteTreatments = async (id) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/treatment_master/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

// Doctors api end ----------

//  Medicines api start ----------

export const fetchMedicines = async ({ searchTerm }) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const params = {
      search: searchTerm,
    };

    const response = await axios.get(
      `${API_BASE_URL}/api/medicine_master?customerId=${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateMedicines = async (id, name) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/medicine_master/${id}`,
      name,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const addMedicines = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      //   `${API_BASE_URL}/api/medicine_master/${hospitalId}`,
      `${API_BASE_URL}/api/medicine_master?customerId=${hospitalId}`,
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
    return error;
  }
};

export const deleteMedicines = async (id) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/medicine_master/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

// Medicines api end ----------

//  Labs api start ----------

export const fetchLabs = async ({ searchTerm }) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const params = {
      search: searchTerm,
    };

    const response = await axios.get(
      `${API_BASE_URL}/api/lab_master?customerId=${hospitalId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateLabs = async (id, name) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(
      `${API_BASE_URL}/api/lab_master/${id}`,
      name,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

export const addLabs = async (req_body) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.post(
      `${API_BASE_URL}/api/lab_master?customerId=${hospitalId}`,
      // `${API_BASE_URL}/api/lab_master`,
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
    return error;
  }
};

export const deleteLabs = async (id) => {
  try {
    const token = getAuthToken();
    const hospitalId = getHospitalId();

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.delete(
      `${API_BASE_URL}/api/lab_master/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response:", response.data);

    return response.data;
  } catch (error) {
    return error;
  }
};

// Labs api end ----------
