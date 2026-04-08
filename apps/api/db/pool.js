const { Pool } = require('pg');
require('dotenv').config();

function getSslConfig() {
  const url = process.env.DATABASE_URL || '';
  if (url.includes('localhost') || url.includes('127.0.0.1')) return false;
  const config = { rejectUnauthorized: true };
  if (process.env.DATABASE_CA_CERT) config.ca = process.env.DATABASE_CA_CERT;
  return config;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: getSslConfig(),
});
pool.on('error', (err) => console.error('Unexpected database error', err));

module.exports = { pool };
