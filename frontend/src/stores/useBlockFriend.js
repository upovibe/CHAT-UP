import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useBlockFriend = create((set, get) => ({
  // State variables
  loading: false,
  error: null,
  success: null,
  blockedFriends: [],
  blockedFriendsCount: 0,

  // Actions

  // Reset error state
  resetError: () => set({ error: null }),

  // Block a user
  blockUser: async (userId) => {
    if (!userId) {
      set({ error: "User ID is required" });
      return;
    }

    set({ loading: true, error: null, success: null });

    try {
      const response = await axiosInstance.post("/block", {
        userId,
      });

      set({
        success: response.data.message,
        loading: false,
      });

      // Refresh blocked friends list
      await get().getBlockedFriends();
    } catch (error) {
      set({
        error: error.response?.data?.message || "An error occurred",
        loading: false,
      });
    }
  },

  // Unblock a user
  unblockUser: async (userId) => {
    if (!userId) {
      set({ error: "User ID is required" });
      return;
    }

    set({ loading: true, error: null, success: null });

    try {
      const response = await axiosInstance.post("/unblock", {
        userId,
      });

      set({
        success: response.data.message,
        loading: false,
      });

      // Refresh blocked friends list
      await get().getBlockedFriends();
    } catch (error) {
      set({
        error: error.response?.data?.message || "An error occurred",
        loading: false,
      });
    }
  },

// Get list of blocked friends
getBlockedFriends: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.get("/blocked");
    const blockedUsers = response.data?.blockedUsers || [];
    set({
      blockedFriends: blockedUsers,
      blockedFriendsCount: blockedUsers.length,
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