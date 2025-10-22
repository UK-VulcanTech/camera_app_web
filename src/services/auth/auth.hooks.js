import { useMutation } from "@tanstack/react-query"
import { authService } from "./auth.services"

export const useLogin = () => {

    return useMutation({
        mutationFn: async (userData) => {
            try {
                const response = await authService.login(userData);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }
                throw error?.response?.data?.detail || error;
            }
        },
        onSuccess: async (data) => {
            if (data.access_token) {
                try {
                    localStorage.setItem('auth_token', data.access_token);
                    localStorage.setItem('role', data.role);
                }
                catch (error) {
                    console.error('Error storing auth data: ', error);
                }
            }
        }
    })
}