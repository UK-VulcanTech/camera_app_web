import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { cameraServices } from "./camera.services"

export const useGetCameraList = () => {
    return useQuery({
        queryKey: ['camera-list'],
        queryFn: async () => {
            try {
                const response = await cameraServices.getCameraList();
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Failed to get camera listing: ', error.response)
                }
                throw error?.response?.data?.detail || error;
            }
        },
        retry: 1,
        retryDelay: 20000,

    })
}

export const useGetCameraById = () => {
    return useQuery({
        queryKey: ['camera-by-Id'],
        queryFn: async () => {
            try {
                const response = await cameraServices.getCameraById();
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Failed to get camera details: ', error.response)
                }
                throw error?.response?.data?.detail || error;
            }
        },
        retry: 1,
        retryDelay: 20000,

    })
}

export const useEditCamera = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ data, cameraId }) => {
            try {
                const response = await cameraServices.editCamera(data, cameraId);
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
        onSuccess: () => {
            queryClient.invalidateQueries(['camera-list'])
        }
    })
}
export const useDeleteCamera = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            try {
                const response = await cameraServices.deleteCamera(id);
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
        onSuccess: () => {
            queryClient.invalidateQueries(['camera-list']);
            queryClient.refetchQueries(['camera-list']);
        }
    })
}


export const useGetCameraCount = () => {
    return useQuery({
        queryKey: ['camera-count'],
        queryFn: async () => {
            try {
                const response = await cameraServices.getCameraCount();
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Failed to get camera count: ', error.response)
                }
                throw error?.response?.data?.detail || error;
            }
        },
        retry: 1,
        retryDelay: 20000,
    })
}

export const useGetAlertsById = (id) => {
    return useQuery({
        queryKey: ['camera-alerts-by-Id'],
        queryFn: async () => {
            try {
                const response = await cameraServices.getAlertById(id);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Failed to get alerts: ', error.response);
                }
                throw error?.response?.data?.detail || error;
            }
        },
        retry: 1,
        retryDelay: 20000,
    })
}

export const useGetAllAlerts = () => {
    return useQuery({
        queryKey: ['all-alerts'],
        queryFn: async () => {
            try {
                const response = await cameraServices.getAllAlerts();
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Failed to get alerts: ', error.response)
                }
                throw error?.response?.data?.detail || error;
            }
        },
        retry: 1,
        retryDelay: 20000,
    })
}
export const useCreateZones = () => {
    return useMutation({
        mutationFn: async (payload) => {
            try {
                const response = await cameraServices.createZone(payload);
                return response.data;
            }
            catch (error) {
                if (error.response) {
                    console.error('Response Status: ', error.response.status);
                    console.error('Response Data: ', error.response.data);
                }
                throw error?.response?.data?.detail || error;
            }
        }
    })
}