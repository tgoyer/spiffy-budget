////////////////////////////////////////
////////// Session Controller //////////
////////////////////////////////////////

import express from 'express';
import argon2 from 'argon2';

import { query } from '../db_manager.js';
import { createToken } from '../session_manager.js';

const router = express.Router();

// Login
router.post('/session', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

    try {
        const result = await query('SELECT * FROM users WHERE email=$1', [email]);
        const user = result.rows[0];
        if (!user || !(await argon2.verify(user.password_hash, password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = createToken({ userId: user.id });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // set to true in production
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        }).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                family_id: user.family_id,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.delete('/session', (req, res) => {
    res.clearCookie('token').json({ message: 'Logged out' });
});

export default router;
