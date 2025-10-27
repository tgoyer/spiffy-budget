import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.NEON_DB_URL,
  ssl: { rejectUnauthorized: false } // required for Neon serverless
});
