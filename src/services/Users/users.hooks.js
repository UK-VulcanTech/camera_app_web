import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { userServices } from "./users.services"

export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            try {
                const response = await userServices.getUsers();
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Failed to get users: ', error.response);
                }
                throw error;
            }
        },
        retry: 1,
        retryDelay: 20000,

    })
}

export const useCreateUsers = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (userData) => {
            console.log(userData)
            try {
                const response = await userServices.createUser(userData);
                console.log('Create User Response: ', response?.data);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    })
}
export const useDeleteUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            try {
                const response = await userServices.deleteUser(id);

                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    })
}

export const useEditUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ data, userId }) => {
            try {
                const response = await userServices.editUser(data, userId);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
        }
    })
}
