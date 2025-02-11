// index.js

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { app, server, io } from './lib/socket.js';

import path from "path"; 

// Import routes
import authRoutes from "./routes/authRoute.js";
import searchRoutes from "./routes/searchRoutes.js";
import requestRoutes from "./routes/requestRoute.js";
import blockRoutes from "./routes/blockRoutes.js";
import chatMessageRoutes from "./routes/chatMessageRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js';

// Initialize dotenv
dotenv.config();

// Initialize Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));


// Initialize Routes
app.use("/api/auth", authRoutes);
app.use("/api", searchRoutes); 
app.use("/api/notifications", notificationRoutes);
app.use("/api/friend-requests", requestRoutes);
app.use("/api", blockRoutes);
app.use("/api/chatmessages", chatMessageRoutes);

// Define the port number the server will listen on
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
    });
}

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

