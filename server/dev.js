import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import app from './app.js';

app.listen(5000, () => console.log('API running on http://localhost:5000'));
