import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { initializeSocket } from "@/lib/socket";

export const useNotification = create((set, get) => ({
  notifications: [],
  isLoading: false,
  error: null,
  socket: null,

  // Fetch all notifications
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/notifications");
      set({ notifications: response.data.notifications, isLoading: false });
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      set({ error: error.message, isLoading: false });
    }
  },

  // Create a new notification
  createNotification: async (notificationData) => {
    try {
      const response = await axiosInstance.post("/notifications", notificationData);
      set((state) => ({
        notifications: [response.data, ...state.notifications],
      }));
    } catch (error) {
      console.error("Error creating notification:", error.message);
      set({ error: error.message });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      await axiosInstance.post("/notifications/mark-all-as-read");
      set((state) => ({
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      }));
    } catch (error) {
      console.error("Error marking notifications as read:", error.message);
      set({ error: error.message });
    }
  },

  // Clear (soft delete) all notifications
  clearAllNotifications: async () => {
    try {
      await axiosInstance.post("/notifications/clear-all");
      set({ notifications: [] }); // Remove all notifications from state
    } catch (error) {
      console.error("Error clearing all notifications:", error.message);
      set({ error: error.message });
    }
  },

  // Clear (soft delete) a specific notification
  clearNotification: async (notificationId) => {
    try {
      await axiosInstance.post("/notifications/clear", { notificationId });
      set((state) => ({
        notifications: state.notifications.filter(
          (notification) => notification._id !== notificationId
        ),
      }));
    } catch (error) {
      console.error("Error clearing notification:", error.message);
      set({ error: error.message });
    }
  },

  // Subscribe to new notifications
  subscribeToNotifications: (userId) => {
    const socket = initializeSocket(userId);
    socket.on("newNotification", (newNotification) => {
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
      }));
    });
    set({ socket });
  },

  // Unsubscribe from new notifications
  unsubscribeFromNotifications: () => {
    const socket = get().socket;
    if (socket) {
      socket.off("newNotification");
      socket.disconnect();
      set({ socket: null });
    }
  },
}));