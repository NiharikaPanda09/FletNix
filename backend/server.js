require('dotenv').config();

const express    = require('express');
const cors       = require('cors');
const connectDB  = require('./config/db');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Database ─────────────────────────────────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',  require('./routes/auth'));
app.use('/api/shows', require('./routes/shows'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.status(200).json({ status: 'OK', message: 'FletNix backend is running.' })
);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
