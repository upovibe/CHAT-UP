import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useFriendRequests = create((set) => ({
  requests: [],
  friends: [],
  sentRequests: [],
  isLoading: false,
  error: null,


}));
