require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const { errorHandler } = require('./middleware/errors');
const v1Router = require('./routes/v1');

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim()) : '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => res.json({ name: 'Canopy API', version: '1.0.0', status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/v1', v1Router);

app.use(errorHandler);

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('DATABASE_URL not set — skipping migrations');
    return;
  }
  const client = new Client({
    connectionString,
    ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await client.query(sql);
    console.log('✅ Migrations ran successfully');
  } catch (err) {
    console.error('❌ Migration error:', err.message);
  } finally {
    await client.end();
  }
}

runMigrations().then(() => {
  app.listen(PORT, () => console.log(`Canopy API running on :${PORT}`));
});
