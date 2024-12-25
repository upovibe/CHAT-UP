import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useMessage = create((set) => ({
  messages: [],
  isLoading: false,
  error: null,

  // Fetch messages with pagination
  fetchMessages: async (chatId, page = 1, limit = 50) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/messages/chat/${chatId}`, {
        params: { page, limit },
      });
      set({ messages: response.data.data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Send a new message
  sendMessage: async ({ sender, recipient, text, attachments }) => {
    if (!sender || !recipient || !text) {
      set({ error: "Sender, recipient, and text are required." });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/messages/send", {
        sender,
        recipient,
        text,
        attachments,
      });
      set((state) => ({
        messages: [...state.messages, response.data.data],
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
  
  // Mark a message as read
  markMessageAsRead: async (messageId) => {
    try {
      await axiosInstance.put(`/messages/${messageId}/read`);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, status: "read" } : msg
        ),
      }));
    } catch (err) {
      console.error("Error marking message as read:", err.message);
    }
  },

  // Update a message
  updateMessage: async (messageId, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/messages/${messageId}`, updatedData);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, ...response.data.data } : msg
        ),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  // Soft delete a message
  deleteMessage: async (messageId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/messages/${messageId}`);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, ...response.data.data } : msg
        ),
        isLoading: false,
      }));
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));

