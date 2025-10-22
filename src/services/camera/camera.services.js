import API from '../api';

const BASE_URL = import.meta.env.VITE_API_URL;
// const token = localStorage.getItem('auth_token');

export const cameraServices = {
    getCameraList: () => {
        console.log(`Making request to: ${BASE_URL}/api/v1/camera/admin/`);
        return API.get(`${BASE_URL}/api/v1/camera/admin/`);
    },

    getCameraById: (id) => {
        console.log(`Making request to: ${BASE_URL}/api/v1/camera/admin/${id}`);
        return API.get(`${BASE_URL}/api/v1/camera/admin/${id}`);
    },

    editCamera: (data, id) => {
        console.log(`Making request to: ${BASE_URL}/api/v1/camera/admin/${id}`);
        return API.patch(`${BASE_URL}/api/v1/camera/admin/${id}`, data);
    },

    deleteCamera: (id) => {
        console.log(`Making request to: ${BASE_URL}/api/v1/camera/admin/${id}`);
        return API.delete(`${BASE_URL}/api/v1/camera/admin/${id}`);
    },

    getCameraCount: () => {
        console.log(`Making request to: ${BASE_URL}/api/v1/camera/admin/count`);
        return API.get(`${BASE_URL}/api/v1/camera/admin/count`);
    },

    // Alerts Section
    getAlertById: (id) => {
        console.log(`Making API request to: ${BASE_URL}/api/v1/alerts/camera/${id}`);
        return API.get(`${BASE_URL}/api/v1/alerts/camera/${id}`, {
        })

    },

    getAllAlerts: () => {
        console.log(`Making API request to: ${BASE_URL}/api/v1/alerts/dashboard`);
        return API.get(`${BASE_URL}/api/v1/alerts/dashboard`)
    },

    //Zones Section
    createZone: (payload) => {
        console.log(`Making API request to: ${BASE_URL}/api/v1/redzones/`);
        return API.post(`${BASE_URL}/api/v1/redzones/`, payload)
    }

}