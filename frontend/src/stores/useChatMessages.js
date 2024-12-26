import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useChatMessages = create((set) => ({
  chatMessages: [],
  isLoading: false,

  // Action to fetch chat messages
  fetchChatMessages: async (userId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(`/chatmessages/${userId}`);
      set({ chatMessages: response.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching chat messages:", error.message);
      set({ isLoading: false });
    }
  },

  sendChatMessage: async (message) => {
    try {
      // Optimistic update
      const tempMessage = { ...message, _id: `temp-${Date.now()}` }; // Assign temp ID
      set((state) => ({ chatMessages: [...state.chatMessages, tempMessage] }));

      const response = await axiosInstance.post("/chatmessages/send", message);
      // Replace temp message with actual response
      set((state) => ({
        chatMessages: state.chatMessages.map((msg) =>
          msg._id === tempMessage._id ? response.data : msg
        ),
      }));
    } catch (error) {
      // Rollback on failure
      console.error("Error sending chat message:", error.message);
      set((state) => ({
        chatMessages: state.chatMessages.filter(
          (msg) => !msg._id.startsWith("temp-")
        ),
      }));
    }
  },
}));
