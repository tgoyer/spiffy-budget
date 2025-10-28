/////////////////////////////////////
////////// User Controller //////////
/////////////////////////////////////

import express from 'express';
import argon2 from 'argon2';

import { query } from '../db_manager.js';
import { verifyToken } from '../session_manager.js';

const router = express.Router();

// Register
router.post('/user', async (req, res) => {
    const { email, password, name, familyId } = req.body;
    if (!email || !password || !name || !familyId) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const hash = await argon2.hash(password);
        const result = await query(
            `INSERT INTO users (email, password_hash, name, family_id) 
      VALUES ($1, $2, $3, $4) RETURNING id, email, name, family_id, created_at`,
            [email, hash, name, familyId],
        );
        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Get logged in user
router.get('/user/me', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });

    const payload = verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });

    try {
        const result = await query('SELECT id, email, name, family_id FROM users WHERE id=$1', [payload.userId]);
        if (!result.rows[0]) return res.status(404).json({ error: 'User not found' });
        res.json({ user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

export default router;
