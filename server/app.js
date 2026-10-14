import express from 'express';
import { connectDB } from './db.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    res.json({ ok: true, db: 'connected' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, db: 'error' });
  }
});

export default app;