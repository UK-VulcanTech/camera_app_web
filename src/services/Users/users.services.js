import API from "../api";

const BASE_URL = import.meta.env.VITE_API_URL;
// const token = localStorage.getItem('auth_token');

export const userServices = {
    getUsers: async () => {
        console.log(`Making request to: ${BASE_URL}/api/v1/users`);
        return API.get(`${BASE_URL}/api/v1/users`, {
            timeout: 20000,
        });
    },

    createUser: async (payload) => {
        // console.log('Payload: ', payload)
        console.log(`Making request to: ${BASE_URL}/api/v1/admin/user`);
        return API.post(`${BASE_URL}/api/v1/admin/user`, payload, {
            timeout: 20000,
        })
    },

    deleteUser: async (userId) => {
        console.log(`Making request to: ${BASE_URL}/api/v1/user/${userId}`);
        return API.delete(`${BASE_URL}/api/v1/user/${userId}`,{
             timeout: 20000,
        })
    },

    editUser: async (data, userId) => {
        console.log(`Making request to: ${BASE_URL}/api/v1/user/${userId}`);
        return API.patch(`${BASE_URL}/api/v1/user/${userId}`, data, {
            headers: {
                timeout: 20000,
            }
        })
    }
}