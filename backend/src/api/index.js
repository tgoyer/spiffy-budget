// backend/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import session from './session.js';
import user from './user.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL, // e.g., https://frontend.up.railway.app
        credentials: true,
    }),
);

// Routes
app.use('/', session);
app.use('/', user);

// Example protected route
app.get('/transactions', async (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    // TODO: fetch transactions for user
    res.json([
        {
            id: 1,
            description: 'Sample Transaction 1',
            amount: 100,
        },
        {
            id: 2,
            description: 'Sample Transaction 2',
            amount: 200,
        },
    ]);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
