import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useFriendRequests = create((set) => ({
  requests: [],
  friends: [],
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
        const res = await axiosInstance.post("/friend/send", { recipientId });
        set((state) => ({
            requests: [...state.requests, res.data.friendRequest],
        }));
    } catch (e) {
        console.error("Failed to send friend request:", e.message);
        set({ error: e.message });
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
      const res = await axiosInstance.post(`/api/accept/${requestId}`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== requestId),
        friends: [...state.friends, res.data.request],
      }));
    } catch (e) {
      console.error("Failed to accept friend request:", e.message);
      set({ error: e.message });
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
      await axiosInstance.post(`/api/decline/${requestId}`);
      set((state) => ({
        requests: state.requests.filter((r) => r._id !== requestId),
      }));
    } catch (e) {
      console.error("Failed to decline friend request:", e.message);
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch pending friend requests
  fetchRequests: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.get("/api/requests");
      set({ requests: res.data.requests });
    } catch (e) {
      console.error("Failed to fetch friend requests:", e.message);
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch friends list
  fetchFriends: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await axiosInstance.get("/api/friends");
      set({ friends: res.data.friends });
    } catch (e) {
      console.error("Failed to fetch friends list:", e.message);
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },

  // Remove a friend
  removeFriend: async (friendId) => {
    if (!friendId) {
      console.error("Friend ID is required");
      return;
    }
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.delete(`/api/friends/${friendId}`);
      set((state) => ({
        friends: state.friends.filter((friend) => friend.id !== friendId),
      }));
    } catch (e) {
      console.error("Failed to remove friend:", e.message);
      set({ error: e.message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
