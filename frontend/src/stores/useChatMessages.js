import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { initializeSocket } from "@/lib/socket";

export const useChatMessages = create((set, get) => ({
  chatMessages: [],
  unreadCount: 0,
  isLoading: false,
  socket: null,

  // Fetch all chat messages
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

  // Send a new chat message
  sendChatMessage: async ({ messageData, userId }) => {
    try {
      const response = await axiosInstance.post(
        `/chatmessages/send/${userId}`,
        messageData
      );
      set((state) => ({
        chatMessages: [...state.chatMessages, response.data],
      }));
    } catch (error) {
      console.error("Error sending chat message:", error.message);
    }
  },

  // Fetch unread message count
  fetchUnreadCount: async (userId) => {
    try {
      const response = await axiosInstance.get(`/chatmessages/unread/${userId}`);
      set({ unreadCount: response.data.unreadCount });
    } catch (error) {
      console.error("Error fetching unread count:", error.message);
    }
  },

  // Mark messages as read
  markMessagesAsRead: async (userId) => {
    try {
      await axiosInstance.put(`/chatmessages/read/${userId}`);
      set((state) => ({
        chatMessages: state.chatMessages.map((msg) =>
          msg.receiverId === userId ? { ...msg, read: true } : msg
        ),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Error marking messages as read:", error.message);
    }
  },

  // Delete a chat message
  deleteChatMessage: async (messageId) => {
    try {
      await axiosInstance.put(`/chatmessages/delete/${messageId}`);
      set((state) => ({
        chatMessages: state.chatMessages.filter((msg) => msg._id !== messageId),
      }));
    } catch (error) {
      console.error("Error deleting chat message:", error.message);
    }
  },

  // Subscribe to real-time updates for chat messages
  subscribeToChatMessages: (userId) => {
    const socket = initializeSocket(userId);

    // Handle new chat messages
    socket.on("newChatMessage", (newMessage) => {
      set((state) => ({
        chatMessages: [...state.chatMessages, newMessage],
        unreadCount: state.unreadCount + 1,
      }));
    });

    // Handle message read events
    socket.on("messageRead", ({ messageId }) => {
      set((state) => ({
        chatMessages: state.chatMessages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        ),
      }));
    });

    // Handle message deletion events
    socket.on("messageDeleted", ({ messageId }) => {
      set((state) => ({
        chatMessages: state.chatMessages.filter((msg) => msg._id !== messageId),
      }));
    });

    set({ socket });
  },

  // Unsubscribe from real-time updates
  unsubscribeFromChatMessages: () => {
    const socket = get().socket;
    if (socket) {
      socket.off("newChatMessage");
      socket.off("messageRead");
      socket.off("messageDeleted");
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
