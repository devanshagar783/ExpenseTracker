import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDB } from './db.js';
import { requireAuth } from './middleware/auth.js';
import authRouter, { getMe } from './routes/auth.js';

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Connect to the database before any API route runs
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true, db: 'connected' }));
app.use('/api/auth', authRouter);
app.get('/api/me', requireAuth, getMe);

export default app;