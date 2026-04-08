require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { errorHandler } = require('./middleware/errors');
const { apiLimiter, authLimiter } = require('./middleware/rateLimit');
const v1Router = require('./routes/v1');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet({ contentSecurityPolicy: false }));

// CORS — reject unknown origins instead of allowing all
const { ALLOWED_ORIGINS } = require('./config');

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, server-to-server, same-origin)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS && ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    if (!ALLOWED_ORIGINS) {
      // Development fallback — warn but allow
      if (process.env.NODE_ENV !== 'production') return callback(null, true);
      return callback(new Error('CORS: origin not allowed'));
    }
    callback(new Error('CORS: origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing — stricter default
app.use(express.json({ limit: '16kb' }));
app.use(cookieParser());

// Rate limiting
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/auth/forgot-password', authLimiter);
app.use('/api/v1', apiLimiter);

// Health / info (no auth)
app.get('/', (req, res) => res.json({ name: 'Canopy API', version: '1.0.0', status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/v1', v1Router);

app.use(errorHandler);

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('DATABASE_URL not set — skipping migrations');
    return;
  }
  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  const rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';
  const sslConfig = isLocal ? false : { rejectUnauthorized };
  if (!isLocal && process.env.DATABASE_CA_CERT) sslConfig.ca = process.env.DATABASE_CA_CERT;
  const client = new Client({ connectionString, ssl: sslConfig });
  try {
    await client.connect();
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(sql);
    console.log('Migrations ran successfully');
  } catch (err) {
    console.error('Migration error:', err.message);
  } finally {
    await client.end();
  }
}

runMigrations().then(() => {
  app.listen(PORT, () => console.log(`Canopy API running on :${PORT}`));
});
