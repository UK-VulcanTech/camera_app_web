
import API from '../api';

const BASE_URL = import.meta.env.VITE_API_URL;

export const authService = {
    
    login: (payload) => {
        console.log(`Making request to: ${BASE_URL}/api/v1/login`);
        return API.post(`${BASE_URL}/api/v1/login`, payload, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
}