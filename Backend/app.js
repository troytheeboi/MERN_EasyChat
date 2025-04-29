import express from "express";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  connectDB();
  console.log("Server is running on port 3000");
});
