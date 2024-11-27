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
  signup: async (data) => {
    try {
      set({ isSigingUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
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

  // Login method
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data.user });
    } catch (e) {
      console.error("Login failed:", e.message);
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
      const res = await axiosInstance.patch("/auth/profile", data);
      if (res.data.user) {
        set({ authUser: res.data.user });
      }
    } catch (e) {
      console.error("Update profile failed:", e.message);
      throw e;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

//  login: async (data) => {
//   try {
//     set({ isLoggingIn: true });
//     const res = await axiosInstance.post("/auth/login", data);
//     if (res.data.user) {
//       set({ authUser: res.data.user });
//     } else {
//       console.error("Login failed: No user found");
//       throw new Error("Login failed: No user found");
//     }
//   } catch (e) {
//     console.error("Login failed:", e.message);
//     throw e;
//   } finally {
//     set({ isLoggingIn: false });
//   }
// },
