// server.js - place at frontend project root
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

// serve react build
app.use(express.static(path.join(__dirname, 'build')));

// proxy API requests to backend (server-side)
app.use('/api', createProxyMiddleware({
  target: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  changeOrigin: true,
  secure: true, // keep true for TLS
  pathRewrite: { '^/api': '' }, // maps /api/signup -> /signup
  onProxyReq(proxyReq, req, res) {
    // optional: forward original host, add headers, auth, etc.
  }
}));

// All other routes -> index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => console.log(`Frontend proxy server listening on ${PORT}`));
