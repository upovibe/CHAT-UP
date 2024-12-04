import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useFriendRequests = create((set) => ({
  requests: [],
  friends: [],
  sentRequests: [], // New state for sent requests
  isLoading: false,
  error: null,

  // Send a friend request
  sendRequest: async (recipientId) => {
    if (!recipientId) {
      console.error("Recipient ID is required");
      return;
    }
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.post("/send", { recipientId });
      set((state) => ({
        sentRequests: [...state.sentRequests, recipientId], // Track the sent request
      }));
    } catch (e) {
      console.error("Failed to send friend request:", e.message);
      set({ error: e.response?.data?.message || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Accept a friend request
  acceptRequest: async (requestId) => {
    if (!requestId) {
      console.error("Request ID is required");
      return;
    }
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.post(`/accept/${requestId}`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== requestId),
        friends: [...state.friends, res.data.request],
      }));
    } catch (e) {
      console.error("Failed to accept friend request:", e.message);
      set({ error: e.response?.data?.message || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Decline a friend request
  declineRequest: async (requestId) => {
    if (!requestId) {
      console.error("Request ID is required");
      return;
    }
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.post(`/decline/${requestId}`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== requestId),
      }));
    } catch (e) {
      console.error("Failed to decline friend request:", e.message);
      set({ error: e.response?.data?.message || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete a friend request
  deleteRequest: async (requestId) => {
    console.log("Attempting to delete request:", requestId);
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.delete(`/delete/${requestId}`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== requestId),
      }));
      console.log("Successfully deleted request:", requestId);
    } catch (e) {
      console.error("Failed to delete friend request:", e.response || e.message);
      set({ error: e.response?.data?.message || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch pending friend requests
  fetchRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.get("/requests");
      set({ requests: res.data.requests });
    } catch (e) {
      console.error("Failed to fetch friend requests:", e.message);
      set({ error: e.response?.data?.message || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch sent friend requests
  fetchSentRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.get("/sent-requests");
      set({ sentRequests: res.data.sentRequests.map((req) => req.id) });
    } catch (e) {
      console.error("Failed to fetch sent friend requests:", e.message);
      set({ error: e.response?.data?.message || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch friends list
  fetchFriends: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.get("/friends");
      set({ friends: res.data.friends });
    } catch (e) {
      console.error("Failed to fetch friends list:", e.message);
      set({ error: e.response?.data?.message || e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove a friend
  // removeFriend: async (friendId) => {
  //   if (!friendId) {
  //     console.error("Friend ID is required");
  //     return;
  //   }
  //   try {
  //     set({ isLoading: true, error: null });
  //     await axiosInstance.delete(`/friends/${friendId}`);
  //     set((state) => ({
  //       friends: state.friends.filter((friend) => friend.id !== friendId),
  //     }));
  //   } catch (e) {
  //     console.error("Failed to remove friend:", e.message);
  //     set({ error: e.response?.data?.message || e.message });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },
}));
