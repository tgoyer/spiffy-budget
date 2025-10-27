import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { encrypt, decrypt } from "./crypto.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Helper to protect routes ---
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

// --- Signup ---
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, hash]
    );
    const user = result.rows[0];
    const token = jwt.sign({ user_id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Email may already exist" });
  }
});

// --- Login ---
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ user_id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Transactions API ---
app.get("/transactions", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, description, amount, created_at FROM transactions WHERE user_id = $1",
      [req.user.user_id]
    );
    const transactions = result.rows.map(t => ({ ...t, amount: decrypt(t.amount) }));
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/transactions", requireAuth, async (req, res) => {
  const { description, amount } = req.body;
  const encryptedAmount = encrypt(amount.toString());
  try {
    await pool.query(
      "INSERT INTO transactions (user_id, description, amount) VALUES ($1, $2, $3)",
      [req.user.user_id, description, encryptedAmount]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));