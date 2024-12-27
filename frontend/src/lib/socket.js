// lib/socket.js
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const initializeSocket = (userId) => {
  return io(BASE_URL, {
    query: {
      userId,
    },
    transports: ["websocket"],
    upgrade: false,
  });
};
