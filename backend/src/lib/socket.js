import { Server } from "socket.io";
import http from "http";
import express from "express";

// Initialize an Express application
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

export const getRecieverSocketId = (userId) => {
    return userSocketMap[userId];
};

// Store online users
const userSocketMap = {};

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

    // io.emit is used to send events to all the connected clients.
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

    socket.on("error", (err) => {
        console.error("Socket encountered an error:", err.message);
      });
      
});

export { app, server, io };
