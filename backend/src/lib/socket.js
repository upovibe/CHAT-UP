import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize an Express application
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true,
    },
});

// Store online users
const userSocketMap = {};

// Function to get the receiver's socket ID
export const getRecieverSocketId = (userId) => {
    return userSocketMap[userId];
};

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) userSocketMap[userId] = socket.id;

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
