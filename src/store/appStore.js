import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useDashboardStore = create(
    persist(
        (set) => ({
            sideBarOption: 'Dashboard',
            setSideBarOption: (selectedOption) => set({ sideBarOption: selectedOption }),
            userDetails: [],
            setUserDetails: (data) => set({ userDetails: data }),
            cameraDetails: [],
            setCameraDetails: (data) => set({ cameraDetails: data }),
        }),
        {
            name: 'dashboard-storage', // Storage key
            partialize: (state) => ({ cameraDetails: state.cameraDetails }),
        }
    )
);