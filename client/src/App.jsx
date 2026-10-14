import { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setStatus(d.ok ? 'API and database connected ✅' : 'Database error ❌'))
      .catch(() => setStatus('API not reachable ❌'));
  }, []);

  return <h1>Expense Tracker: {status}</h1>;
}