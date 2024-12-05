import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useFriendRequests = create((set) => ({
  // State variables
  loading: false,
  error: null,
  success: null,
  pendingRequests: [],
  cancelledRequests: [], // Updated to reflect cancelled spelling

  // Actions

  // Send Friend Request
  sendFriendRequest: async (receiverId) => {
    set({ loading: true, error: null, success: null });

    try {
      const response = await axiosInstance.post("/friend-requests/send", {
        receiverId,
      });

      set({
        success: response.data.message,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "An error occurred",
        loading: false,
      });
    }
  },

  // Cancel Friend Request
  cancelFriendRequest: async (receiverId) => {
    set({ loading: true, error: null, success: null });

    try {
      const response = await axiosInstance.post("/friend-requests/cancel", {
        receiverId,
      });

      set({
        success: response.data.message,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "An error occurred",
        loading: false,
      });
    }
  },

  // Get Cancelled Friend Requests
  getCancelledFriendRequests: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/friend-requests/cancelled");
      set({
        cancelledRequests: response.data.cancelledRequests,
        loading: false,
      });
    } catch (error) {
      set({ error: error.response?.data?.message || "An error occurred", loading: false });
    }
  },

  // Get Pending Friend Requests
  getPendingFriendRequests: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get("/friend-requests/pending");

      set({
        pendingRequests: response.data.pendingRequests,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "An error occurred",
        loading: false,
      });
    }
  },
}));
