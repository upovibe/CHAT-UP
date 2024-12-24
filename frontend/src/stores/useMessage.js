import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

const useMessage = create((set) => ({
  isLoading: false,
  error: null,
  messageSent: null,

  // Action to send a message
  sendMessage: async (sender, recipient, text, attachments) => {
    set({ isLoading: true, error: null, messageSent: null });

    try {
      // Make an API request to send the message
      const response = await axiosInstance.post("/message/send", {
        sender,
        recipient,
        text,
        attachments,
      });

      set({ isLoading: false, messageSent: response.data.data });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || error.message });
    }
  },

  // Optional: Action to reset the state (useful for clearing messages/errors after sending)
  reset: () => set({ isLoading: false, error: null, messageSent: null }),
}));

export default useMessage;
