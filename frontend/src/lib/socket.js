// import { io } from "socket.io-client";

// const BASE_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5001";

// export const initializeSocket = (userId) => {
//   return io(BASE_URL, {
//     query: {
//       userId,
//     },
//     transports: ["websocket"],
//     upgrade: false,
//   });
// };


import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const initializeSocket = (userId) => {
  return io(BASE_URL, {
    query: {
      userId,
    },
    transports: ["websocket"],
    upgrade: false,
  });
};
