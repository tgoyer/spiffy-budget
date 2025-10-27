// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g., https://frontend.up.railway.app
    credentials: true,
  })
);

// Routes
app.use("/", authRoutes);

// Example protected route
app.get("/transactions", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  // TODO: fetch transactions for user
  res.json({ transactions: [] });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
