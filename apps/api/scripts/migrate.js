const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');
  const sslConfig = isLocal ? false : { rejectUnauthorized: true };
  if (!isLocal && process.env.DATABASE_CA_CERT) sslConfig.ca = process.env.DATABASE_CA_CERT;

  const client = new Client({
    connectionString,
    ssl: sslConfig,
  });
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    const sql = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
    console.log('Running migration...');
    await client.query(sql);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();