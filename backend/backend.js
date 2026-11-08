import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { detectAlgorithm } from './algorithmDetector.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Lightweight request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Root + health check endpoints (useful for monitoring and quick sanity checks)
app.get('/', (_req, res) => {
  res.json({
    name: 'Algorithm Visualizer API',
    status: 'ok',
    endpoints: ['GET /health', 'POST /api/analyze'],
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.post('/api/analyze', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Weighted scoring across all known algorithm signatures
    const result = detectAlgorithm(code);

    res.json({
      explanation: result.explanation,
      suggestedAlgorithm: result.key, // key matches a frontend visualizer option
      algorithmName: result.name,
      confidence: result.confidence, // 0-99
      alternatives: result.alternatives, // [{ key, name, score }]
      success: true,
      method: 'Weighted pattern scoring',
    });
  } catch (err) {
    console.error('Analysis error:', err);
    res.status(500).json({
      error: 'Failed to analyze code',
      details: err.message,
      success: false
    });
  }
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

app.listen(PORT, () => {
  console.log(`🚀 Algorithm Visualizer API running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});