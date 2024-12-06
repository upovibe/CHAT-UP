import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useFriendRequests = create((set, get) => ({
  // State variables
  loading: false,
  error: null,
  success: null,
  pendingRequests: [],
  cancelledRequests: [], 
  receivedRequests: [],
  friendsList: [],

  // Getters (computed state)
  get pendingCount() {
    return get().pendingRequests.length;
  },
  get cancelledCount() {
    return get().cancelledRequests.length;
  },
  get receivedCount() {
    return get().receivedRequests.length;
  },

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

  // Fetch Received Friend Requests
  getReceivedFriendRequests: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get("/friend-requests/received");

      set({
        receivedRequests: response.data.receivedRequests,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || "An error occurred",
        loading: false,
      });
    }
  },

  // Accept Friend Request
  acceptFriendRequest: async (requestId) => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.post("/friend-requests/accept", {
        requestId,
      });

      set({
        success: response.data.message,
        loading: false,
      });

      // Fetch updated received requests
      await get().getReceivedFriendRequests();
    } catch (error) {
      set({
        error: error.response?.data?.message || "An error occurred",
        loading: false,
      });
    }
  },

  // Reject Friend Request
  rejectFriendRequest: async (requestId) => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.post("/friend-requests/reject", {
        requestId,
      });

      set({
        success: response.data.message,
        loading: false,
      });

      // Fetch updated received requests
      await get().getReceivedFriendRequests();
    } catch (error){
      set({
        error: error.response?.data?.message || "An error occurred",
        loading: false,
      });
    }
  },

  // Get Friends List (new action)
  getFriendsList: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axiosInstance.get("/friend-requests/friends");

      set({
        friendsList: response.data.friends,  // Save friends data
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
