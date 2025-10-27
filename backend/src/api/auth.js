// backend/auth.js
import express from "express";
import argon2 from "argon2";

import { query } from "../db.js";
import { createToken, verifyToken } from "../sessions.js";

const router = express.Router();

// Signup
router.post("/users", async (req, res) => {
  const { email, password, name, family_id } = req.body;
  if (!email || !password || !name || !family_id) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const hash = await argon2.hash(password);
    const result = await query(
      `INSERT INTO users (email, password_hash, name, family_id) 
      VALUES ($1, $2, $3, $4) RETURNING id, email, name, family_id, created_at`,
      [email, hash, name, family_id]
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Login
router.post("/sessions", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password" });

  try {
    const result = await query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];
    if (!user || !(await argon2.verify(user.password_hash, password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken({ userId: user.id });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true, // set to true in production
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          family_id: user.family_id,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Logout
router.delete("/sessions", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out" });
});

// Current user
router.get("/sessions/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const payload = verifyToken(token);
  if (!payload) return res.status(401).json({ error: "Invalid token" });

  try {
    const result = await query("SELECT id, email, name, family_id FROM users WHERE id=$1", [payload.userId]);
    if (!result.rows[0]) return res.status(404).json({ error: "User not found" });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
