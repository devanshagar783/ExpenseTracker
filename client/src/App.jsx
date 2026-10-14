import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { api } from './api/client.js';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/api/me')
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function handleGoogle(credentialResponse) {
    try {
      setError('');
      const d = await api('/api/auth/google', {
        method: 'POST',
        body: { credential: credentialResponse.credential },
      });
      setUser(d.user);
    } catch (e) {
      setError(e.message);
    }
  }

  async function logout() {
    await api('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  if (!user) {
    return (
      <div style={{ maxWidth: 360, margin: '80px auto', textAlign: 'center' }}>
        <h1>Expense Tracker</h1>
        <p>Sign in to manage your money.</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin onSuccess={handleGoogle} onError={() => setError('Google sign-in failed')} />
        </div>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' }}>
      {user.avatar && (
        <img src={user.avatar} alt="" referrerPolicy="no-referrer" width="72" height="72" style={{ borderRadius: '50%' }} />
      )}
      <h1>Welcome, {user.name} 👋</h1>
      <p>{user.email}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}