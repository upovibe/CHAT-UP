import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useMessage = create((set, get) => ({
  isLoading: false,
  error: null,
  messageSent: null,

  sendMessage: async (sender, recipient, text, attachments) => {
    if (!sender || !recipient || !text) {
      set({ error: "Please fill in all fields" });
      return;
    }

    set({ isLoading: true, error: null, messageSent: null });

    try {
      const response = await axiosInstance.post("/message/send", {
        sender,
        recipient,
        text,
        attachments,
      });

      if (response.status === 201) {
        set({ isLoading: false, messageSent: response.data.data });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      set({ isLoading: false, error: error.message });
    }
  },

  reset: () => set({ isLoading: false, error: null, messageSent: null }),
}));