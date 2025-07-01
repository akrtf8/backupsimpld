import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getAuthToken = () => localStorage.getItem('simpld-auth-token');

const refreshAuthToken = async () => {
    // Implement token refresh logic here if needed
};

export const fetchPopUpList = async () => {
    try {
        const token = getAuthToken();

        if (!token) {
            throw new Error('User is not authenticated');
        }

        const params = {};

        const response = await axios.get(`${API_BASE_URL}/api/clinic/popup`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params,
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.log('Authorization error, attempting to refresh token.');
                try {
                    await refreshAuthToken();
                    return fetchPopUpList();
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

