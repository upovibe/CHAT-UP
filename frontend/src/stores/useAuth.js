import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { initializeSocket } from "@/lib/socket";

export const useAuth = create((set, get) => ({
  authUser: null,
  visibilityPreferences: {
    showEmail: true,
    showPhone: true,
    showStatus: true,
  },
  isSigingUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isOnline: false,
  onlineUsers: [],
  socket: null,

  // Check authentication status
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/status");
      set({
        authUser: res.data.user,
        visibilityPreferences: res.data.user?.visibilityPreferences || {
          showEmail: true,
          showPhone: true,
          showStatus: true,
        },
      });

      get().connectSocket();

    } catch (e) {
      console.error("Auth check failed:", e.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  // Update visibility preferences
  updateVisibilityPreferences: async (newPreferences) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put("/auth/visibility-preferences", {
        visibilityPreferences: newPreferences,
      });

      if (res.data?.user) {
        set({
          authUser: res.data.user,
          visibilityPreferences: res.data.user.visibilityPreferences,
        });
      } else {
        console.warn("Update succeeded but user data was not returned.");
      }
    } catch (e) {
      console.error("Error updating visibility preferences:", e.message);
      throw new Error(e.response?.data?.message || "Failed to update preferences.");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Signup method
  signup: async (SignupData) => {
    try {
      set({ isSigingUp: true });
      const res = await axiosInstance.post("/auth/signup", SignupData);
      if (res.data.user) {
        set({ authUser: res.data.user });
        get().connectSocket();
      } else {
        await get().checkAuth();
      }
    } catch (e) {
      console.error("Signup failed:", e.message);
      throw e;
    } finally {
      set({ isSigingUp: false });
    }
  },

  // Login method
  login: async (loginData) => {
    try {
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", loginData);

      if (res.data.user) {
        set({
          authUser: res.data.user,
          visibilityPreferences: res.data.user.visibilityPreferences || {
            showEmail: true,
            showPhone: true,
            showStatus: true,
          },
        });
        get().connectSocket();
        return res.data.user;
      }
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
      set({ isLoggingIn: false });
      await axiosInstance.post("/auth/logout");
      get().disconnectSocket();
      set({ authUser: null, onlineUsers: [], isOnline: false });
    } catch (e) {
      console.error("Logout failed:", e.message);
      throw e;
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

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = initializeSocket(authUser._id);

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      set({ isOnline: true });
    });

    socket.on("getOnlineUsers", (onlineUsers) => {
      set({ onlineUsers });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      set({ isOnline: false, onlineUsers: [] });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null, isOnline: false, onlineUsers: [] });
    }
  },
}));
