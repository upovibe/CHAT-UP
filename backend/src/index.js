// index.js

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { app, server, io } from './lib/socket.js';

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
    origin: process.env.CLIENT_URL,
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

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});

