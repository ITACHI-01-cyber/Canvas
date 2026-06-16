import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const app = express();
const PORT = 3000;

// Proxy /api requests to Spring Boot backend
app.use('/api', (req, res, next) => {
  if (req.url === '/health' || req.path === '/health') {
    return next();
  }
  const connector = http.request(
    {
      host: 'localhost',
      port: 8080,
      path: '/api' + req.url,
      method: req.method,
      headers: req.headers,
    },
    (resp) => {
      res.writeHead(resp.statusCode || 200, resp.headers);
      resp.pipe(res);
    }
  );
  
  connector.on('error', () => {
    res.status(502).json({ error: 'Backend Java server is not running or unreachable on port 8080' });
  });

  req.pipe(connector);
});

app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: 'frontend-only',
    env: process.env.NODE_ENV
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
