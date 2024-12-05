import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useNotification = create((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  // Fetch notifications from backend
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/notifications"); 
      set({ notifications: response.data.notifications, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.post("/notifications/mark-all-as-read"); 
      set({ notifications: [] }); // Clear the notifications list after marking them as read
    } catch (error) {
      set({ error: error.message });
    }
  },
  
}));
