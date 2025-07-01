import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthToken = () => localStorage.getItem('simpld-auth-token');
const getCustomerId = () => localStorage.getItem('simpld-customerId');
const getCustomerType = () => localStorage.getItem('simpld-customer-type');

const refreshAuthToken = async () => {
    // Implement token refresh logic here if needed
};

export const fetchClinicData = async () => {
    try {
        const token = getAuthToken();
        const customerId = getCustomerId();
        if (!token) {
            throw new Error('User is not authenticated');
        }


        const response = await axios.get(`${API_BASE_URL}/api/clinic/${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.log('Authorization error, attempting to refresh token.');
                try {
                    await refreshAuthToken();
                    return fetchClinicData();
                } catch (refreshError) {
                    console.log('Token refresh failed:', refreshError);
                    throw new Error('Session expired. Please log in again.');
                }
            } else {
                console.log('API error:', error.response?.statusText);
                throw new Error(error.response?.data?.message || 'Error fetching customers');
            }
        } else {
            console.log('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};

export const fetchHospitalInfo = async () => {
    try {
        const token = getAuthToken();
        const customerId = getCustomerId();
        if (!token) {
            throw new Error('User is not authenticated');
        }


        const response = await axios.get(`${API_BASE_URL}/api/company/${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.log('Authorization error, attempting to refresh token.');
                try {
                    await refreshAuthToken();
                    return fetchHospitalInfo();
                } catch (refreshError) {
                    console.log('Token refresh failed:', refreshError);
                    throw new Error('Session expired. Please log in again.');
                }
            } else {
                console.log('API error:', error.response?.statusText);
                throw new Error(error.response?.data?.message || 'Error fetching customers');
            }
        } else {
            console.log('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};

export const fetchSettingsCount = async () => {
    try {
        const token = getAuthToken();
        const customerId = getCustomerId();
        if (!token) {
            throw new Error('User is not authenticated');
        }


        const response = await axios.get(`${API_BASE_URL}/api/common/settingsCount?customerId=${customerId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.log('Authorization error, attempting to refresh token.');
                try {
                    await refreshAuthToken();
                    return fetchSettingsCount();
                } catch (refreshError) {
                    console.log('Token refresh failed:', refreshError);
                    throw new Error('Session expired. Please log in again.');
                }
            } else {
                console.log('API error:', error.response?.statusText);
                throw new Error(error.response?.data?.message || 'Error fetching customers');
            }
        } else {
            console.log('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};

export const updateClinicData= async (data) => {
    try {
        const token = getAuthToken();
        const customerId = getCustomerId();
        const type = getCustomerType();
    
        if (!token) {
          throw new Error('User is not authenticated');
        }
    
        // Destructure the counts from data to parse them
        const { conversationReminingCount, messageRemainingCount, ...restData } = data;
    
        const response = await axios.put(
          `${API_BASE_URL}/api/clinic/${customerId}`,
          {
            company_id: customerId,
            type,
            ...restData,
            conversationReminingCount: parseInt(conversationReminingCount || 0),
            messageRemainingCount: parseInt(messageRemainingCount || 0),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
    
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.log('Authorization error, attempting to refresh token.');
                try {
                    await refreshAuthToken();
                    return updateClinicData(data);
                } catch (refreshError) {
                    console.log('Token refresh failed:', refreshError);
                    throw new Error('Session expired. Please log in again.');
                }
            } else {
                console.log('API error:', error.response?.statusText);
                throw new Error(error.response?.data?.message || 'Error updating intra-oral list');
            }
        } else {
            console.log('Unexpected error:', error);
            throw new Error('An unexpected error occurred');
        }
    }
};
