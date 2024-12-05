// import express from 'express';
// import cookieParser from 'cookie-parser';
// import cors from 'cors';

// // import dotenv
// import dotenv from 'dotenv';

// // Connect to MongoDB database
// import { connectDB } from './config/db.js';

// // Import routes
// import authRoutes from './routes/authRoute.js';
// import searchRoutes from "./routes/searchRoutes.js";
// import requestRoutes from './routes/requestRoute.js';
// import messageRoutes from './routes/messageRoute.js';
// import blockRoutes from "./routes/blockRoutes.js";
// import notificationRoutes from './routes/notificationRoutes.js';

// // initialize dotenv
// dotenv.config();

// // Initialize an Express application
// const app = express();

// // Initialize Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
// }));

// // Initialize Routes
// app.use("/api/auth", authRoutes);
// app.use("/api", searchRoutes); 
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/friend-requests", requestRoutes);
// app.use("/api", blockRoutes);
// app.use("/api/message", messageRoutes);

// // Define the port number the server will listen on
// const PORT = process.env.PORT || 5001;

// // Log a message when the server starts
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     connectDB();
// });



import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { createServer } from "http";
import { Server } from "socket.io";

// Import routes
import authRoutes from "./routes/authRoute.js";
import searchRoutes from "./routes/searchRoutes.js";
import requestRoutes from "./routes/requestRoute.js";
import messageRoutes from "./routes/messageRoute.js";
import blockRoutes from "./routes/blockRoutes.js";
import notificationRoutes from './routes/notificationRoutes.js';

// Initialize dotenv
dotenv.config();

// Initialize an Express application
const app = express();

// Initialize Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Define the port number the server will listen on
const PORT = process.env.PORT || 5001;

// Create HTTP server and Socket.IO instance
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("subscribe", (userId) => {
        console.log(`User ${userId} subscribed to notifications`);
        socket.join(userId);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Attach Socket.IO instance to req
app.use((req, res, next) => {
    req.io = io; // Makes `io` available to all routes and controllers via `req`
    next();
});

// Initialize Routes
app.use("/api/auth", authRoutes);
app.use("/api", searchRoutes); 
app.use("/api/notifications", notificationRoutes);
app.use("/api/friend-requests", requestRoutes);
app.use("/api", blockRoutes);
app.use("/api/message", messageRoutes);

// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
