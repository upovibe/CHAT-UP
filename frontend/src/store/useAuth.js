import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useAuth = create((set) => ({
  authUser: null,
  isSignUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // Check authentication status
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/status");
      set({ authUser: res.data.user });
    } catch (e) {
      console.error("Auth check failed:", e.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Signup method
  signup: async (data) => {
    try {
      set({ isSignUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      if (res.data.user) {
        set({ authUser: res.data.user });
      } else {
        await useAuth.getState().checkAuth();
      }

      console.log("Signup successful!");
    } catch (e) {
      console.error("Signup failed:", e.message);
      throw e;
    } finally {
      set({ isSignUp: false });
    }
  },
}));
