import { axiosInstance } from '@/lib/axios';
import { create } from 'zustand';

export const useAuth = create((set) => ({
  authUser: null,
  isSignUp: false,
  isLoggingIn: false, // Fixed typo: "isLoggingIng" -> "isLoggingIn"
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
    } catch (e) {
      console.error(e);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
