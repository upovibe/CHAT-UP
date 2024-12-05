import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useFriendRequests = create((set) => ({
  // State variables
  loading: false,
  error: null,
  success: null,

  // Actions
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
   cancelFriendRequest: async (receiverId) => { // Updated to use receiverId
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
}));
 