import express from 'express';
import { courses } from '../src/data/courses';
import { recommend } from '../src/recommendations';

const app = express();
const port = 3001;

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/courses', (_req, res) => {
  res.json({ courses });
});

app.post('/api/recommendations', (req, res) => {
  const { prompt } = req.body;

  if (typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({
      error: 'prompt must be a non-empty string',
    });
  }

  const recommendations = recommend(prompt);

  return res.json({ recommendations });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});