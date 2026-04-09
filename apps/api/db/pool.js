const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });

function getSslConfig() {
  const url = process.env.DATABASE_URL || '';
  if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('@postgres:') || url.includes('@postgres/')) return false;
  // Secure by default; set DATABASE_SSL_REJECT_UNAUTHORIZED=false for managed
  // providers (Railway, Render, etc.) whose certs aren't in Node's trust store.
  const rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';
  const config = { rejectUnauthorized };
  if (process.env.DATABASE_CA_CERT) config.ca = process.env.DATABASE_CA_CERT;
  return config;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: getSslConfig(),
});
pool.on('error', (err) => console.error('Unexpected database error', err));

module.exports = { pool };
