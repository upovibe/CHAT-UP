import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import socket from "@/lib/socket";

export const useNotification = create((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/notifications");
      console.log("Fetched notifications:", response.data.notifications);
      set({ notifications: response.data.notifications, isLoading: false });
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  createNotification: async (notificationData) => {
    try {
      const response = await axiosInstance.post("/notifications", notificationData);
      console.log("Created notification:", response.data.notification);
      set((state) => ({
        notifications: [response.data.notification, ...state.notifications],
      }));
    } catch (error) {
      console.error("Error creating notification:", error.message);
      set({ error: error.message });
    }
  },

  subscribeToNotifications: (userId) => {
    console.log("Subscribing to notifications for user ID:", userId);
    socket.emit("subscribe", userId);

    socket.on("notification", (notification) => {
      console.log("Received notification via WebSocket:", notification);
      set((state) => ({
        notifications: [notification, ...state.notifications],
      }));
    });
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.post("/notifications/mark-all-as-read");
      set({ notifications: [] });
    } catch (error) {
      console.error("Error marking notifications as read:", error.message);
      set({ error: error.message });
    }
  },
}));
