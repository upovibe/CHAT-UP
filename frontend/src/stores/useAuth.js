import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useAuth = create((set) => ({
  authUser: null,
  isSigingUp: false,
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
  signup: async (SignupData) => {
    try {
      set({ isSigingUp: true });
      const res = await axiosInstance.post("/auth/signup", SignupData);
      if (res.data.user) {
        set({ authUser: res.data.user });
      } else {
        await useAuth.getState().checkAuth();
      }
    } catch (e) {
      console.error("Signup failed:", e.message);
      throw e;
    } finally {
      set({ isSigingUp: false });
    }
  },

  login: async (loginData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", loginData);
  
      if (res.data.user) {
        set({ authUser: res.data.user });
        return res.data.user;
      }
  
      // throw new Error("Unexpected response format");
    } catch (e) {
      console.error("Login error:", e.response?.data || e.message);
      throw e;
    } finally {
      set({ isLoggingIn: false });
    }
  },
  

  // Logout method
  logout: async () => {
    try {
      set({ isLoggingIn: true });
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (e) {
      console.error("Logout failed:", e.message);
      throw e;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // Update profile method
  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put("/auth/update-profile", data);
      if (res.data?.user) {
        set({ authUser: res.data.user });
      } else {
        console.warn("Update profile succeeded, but no user data returned.");
      }
    } catch (e) {
      console.error("Update profile error:", e.response?.data?.message || e.message);
      throw new Error(e.response?.data?.message || "Failed to update profile.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  
}));
