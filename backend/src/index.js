import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// import dotenv
import dotenv from 'dotenv';

// Connect to MongoDB database
import { connectDB } from './config/db.js';

// Import routes
import authRoutes from './routes/authRoute.js';
import searchRoutes from "./routes/searchRoutes.js";
import requestRoutes from './routes/requestRoute.js';
import messageRoutes from './routes/messageRoute.js';

// initialize dotenv
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

// Initialize Routes
app.use("/api/auth", authRoutes);
app.use("/api", searchRoutes); 
app.use("/api", requestRoutes);
app.use("/api/message", messageRoutes);

// Define the port number the server will listen on
const PORT = process.env.PORT || 5001;

// Log a message when the server starts
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
