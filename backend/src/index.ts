import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analysisRoutes from './routes/analysisRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS: restrict to frontend origin in production
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow all request origins dynamically (safe for Vercel & localhost development)
    callback(null, origin || true);
  },
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Routes
app.use('/api', analysisRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
