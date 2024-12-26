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

  sendChatMessage: async ({ messageData, userId }) => {
    try {
      const response = await axiosInstance.post(`/chatmessages/send/${userId}`, messageData);
      set((state) => ({
        chatMessages: [...state.chatMessages, response.data],
        isLoading: false,
      }));
    } catch (error) {
      console.error("Error sending chat message:", error.message);
      set({ isLoading: false });
    }
  },
  
}));
