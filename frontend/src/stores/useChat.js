import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useChat = create((set) => ({
  chats: [],
  currentChat: null,
  isLoading: false,
  error: null,

  // Fetch all chats for a user
  fetchChats: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/chats/${userId}`);
      set({ chats: response.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Create or fetch a chat between users
  fetchOrCreateChat: async (senderId, recipientId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/chats/chat", {
        sender: senderId,
        recipient: recipientId,
      });
      set((state) => ({
        ...state,
        currentChat: response.data.data,
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Mark all messages as read when the user opens the chat
  markMessagesAsReadForChat: async (chatId) => {
    try {
      const response = await axiosInstance.put(`/chats/${chatId}/read`);
      console.log(response.data);
  
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.status === "sent" ? { ...msg, status: "read" } : msg
        ),
      }));
    } catch (err) {
      console.error("Error marking messages as read:", err.message);
    }
  },
  
}));