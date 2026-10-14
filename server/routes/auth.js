import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = Router();
const googleClient = new OAuth2Client();

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
};

function publicUser(u) {
  return { id: u.id, email: u.email, name: u.name, avatar: u.avatar };
}

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (typeof credential !== 'string') {
      return res.status(400).json({ error: 'Missing credential' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const p = ticket.getPayload();
    if (!p?.sub || !p.email || !p.email_verified) {
      return res.status(401).json({ error: 'Google account not verified' });
    }

    const user = await User.findOneAndUpdate(
      { googleId: p.sub },
      { $set: { email: p.email, name: p.name, avatar: p.picture } },
      { upsert: true, new: true }
    );

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { ...baseCookie, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error('Google auth failed:', err.message);
    res.status(401).json({ error: 'Sign-in failed' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', baseCookie);
  res.json({ ok: true });
});

export async function getMe(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ error: 'User not found' });
  res.json({ user: publicUser(user) });
}

export default router;