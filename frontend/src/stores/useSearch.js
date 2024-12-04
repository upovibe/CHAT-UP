import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useSearch = create((set) => ({
  searchResults: [],
  isSearching: false,
  error: null,

  // Search users by username
  searchUsers: async (username) => {
    try {
      set({ isSearching: true, error: null });

      const res = await axiosInstance.get(`/search?username=${username}`);
      set({ searchResults: res.data });
    } catch (e) {
      console.error("Search failed:", e.message);
      set({ error: e.message, searchResults: [] });
    } finally {
      set({ isSearching: false });
    }
  },
}));
