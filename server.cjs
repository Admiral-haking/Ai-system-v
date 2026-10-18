const express = require('express');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const port = Number(process.env.PORT || 3003);
const commerceBase = (process.env.COMMERCE_API_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const integrationKey = process.env.AI_INTEGRATION_API_KEY;

app.disable('x-powered-by');

app.use('/api/ai', async (req, res) => {
  if (!integrationKey) return res.status(503).json({ error: 'integration_key_not_configured' });
  const target = `${commerceBase}/api/integrations/ai/v1${req.path}${req.url.includes('?') ? `?${req.url.split('?')[1]}` : ''}`;
  try {
    const response = await fetch(target, {
      method: req.method,
      headers: { accept: 'application/json', 'x-integration-api-key': integrationKey },
    });
    const body = await response.arrayBuffer();
    res.status(response.status).set('content-type', response.headers.get('content-type') || 'application/json').send(Buffer.from(body));
  } catch (error) {
    res.status(502).json({ error: 'commerce_api_unreachable', detail: error instanceof Error ? error.message : 'unknown_error' });
  }
});

const dist = path.join(__dirname, 'dist');
app.use(express.static(dist, { index: 'index.html' }));
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, '127.0.0.1', () => {
  console.log(`AI dashboard listening on 127.0.0.1:${port}`);
});
