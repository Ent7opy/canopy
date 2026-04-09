/**
 * Seed script — creates a demo user with sample data for local development.
 *
 * Usage:  node apps/api/scripts/seed.js
 *   (or)  npm run seed --workspace=apps/api
 *
 * Demo credentials:
 *   email:    demo@canopy.app
 *   password: canopy123
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://canopy:canopy@localhost:5432/canopy';

async function seed() {
  const isLocal = DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1') || DATABASE_URL.includes('@postgres:') || DATABASE_URL.includes('@postgres/');
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });

  try {
    console.log('Seeding Canopy database…');

    const passwordHash = await bcrypt.hash('canopy123', 12);

    // Upsert demo user
    const { rows: [user] } = await pool.query(`
      INSERT INTO users (email, display_name, password_hash, email_verified)
      VALUES ('demo@canopy.app', 'Demo User', $1, TRUE)
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        email_verified = TRUE
      RETURNING id
    `, [passwordHash]);

    const uid = user.id;
    console.log(`  User: demo@canopy.app (id: ${uid})`);

    // ── Habits ────────────────────────────────────────
    const habits = ['Morning stretch', 'Read 20 pages', 'Meditate', 'Walk outside', 'Journal'];
    for (const name of habits) {
      await pool.query(`
        INSERT INTO habits (user_id, name, frequency)
        VALUES ($1, $2, 'daily')
        ON CONFLICT DO NOTHING
      `, [uid, name]);
    }
    console.log(`  Habits: ${habits.length}`);

    // ── Goals ─────────────────────────────────────────
    const goals = [
      { title: 'Ship Canopy v1', timeframe: 'quarterly', type: 'project' },
      { title: 'Run a half marathon', timeframe: 'yearly', type: 'outcome' },
      { title: 'Read 24 books this year', timeframe: 'yearly', type: 'outcome', metric_name: 'books', metric_target: 24, metric_current: 6 },
    ];
    for (const g of goals) {
      await pool.query(`
        INSERT INTO goals (user_id, title, timeframe, type, metric_name, metric_target, metric_current)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [uid, g.title, g.timeframe, g.type, g.metric_name ?? null, g.metric_target ?? null, g.metric_current ?? 0]);
    }
    console.log(`  Goals: ${goals.length}`);

    // ── Projects ──────────────────────────────────────
    const projects = [
      { name: 'Canopy', type: 'app', status: 'active', description: 'Personal growth OS' },
      { name: 'Blog Redesign', type: 'web', status: 'idea', description: 'Rebuild personal blog with Astro' },
    ];
    for (const p of projects) {
      await pool.query(`
        INSERT INTO projects (user_id, name, type, status, description)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [uid, p.name, p.type, p.status, p.description]);
    }
    console.log(`  Projects: ${projects.length}`);

    // ── Skills ────────────────────────────────────────
    const skills = [
      { name: 'TypeScript', category: 'Engineering', value: 72, target: 90 },
      { name: 'React', category: 'Engineering', value: 68, target: 85 },
      { name: 'PostgreSQL', category: 'Engineering', value: 55, target: 80 },
      { name: 'Running', category: 'Fitness', value: 40, target: 70 },
    ];
    for (const s of skills) {
      await pool.query(`
        INSERT INTO skills (user_id, name, category, value, target)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT DO NOTHING
      `, [uid, s.name, s.category, s.value, s.target]);
    }
    console.log(`  Skills: ${skills.length}`);

    // ── Resources (books) ─────────────────────────────
    const books = [
      { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', type: 'book', status: 'active', progress_current: 280, progress_total: 560 },
      { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', type: 'book', status: 'completed', progress_current: 352, progress_total: 352 },
      { title: 'Atomic Habits', author: 'James Clear', type: 'book', status: 'backlog' },
    ];
    for (const b of books) {
      await pool.query(`
        INSERT INTO resources (user_id, title, author, type, status, progress_current, progress_total)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [uid, b.title, b.author, b.type, b.status, b.progress_current ?? null, b.progress_total ?? null]);
    }
    // Add a learning resource
    await pool.query(`
      INSERT INTO resources (user_id, title, author, type, status, progress_current, progress_total)
      VALUES ($1, 'Advanced PostgreSQL', 'Cybertec', 'course', 'active', 4, 12)
      ON CONFLICT DO NOTHING
    `, [uid]);
    console.log(`  Resources: ${books.length + 1}`);

    // ── Hobbies ───────────────────────────────────────
    const hobbies = [
      { name: 'Bouldering', category: 'Sport', status: 'active' },
      { name: 'Film photography', category: 'Creative', status: 'active' },
      { name: 'Surfing', category: 'Sport', status: 'want_to_try' },
    ];
    for (const h of hobbies) {
      await pool.query(`
        INSERT INTO hobbies (user_id, name, category, status)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [uid, h.name, h.category, h.status]);
    }
    console.log(`  Hobbies: ${hobbies.length}`);

    // ── Inbox (Mind Log) ──────────────────────────────
    const thoughts = [
      'Look into Vercel Edge Config for feature flags',
      'Schedule dentist appointment',
      'Research Open Library API for book search',
      'Try that new coffee place on Vitosha blvd',
      'Write a blog post about Zustand patterns',
      'Check Railway pricing for hobby plan',
    ];
    for (const content of thoughts) {
      await pool.query(`
        INSERT INTO inbox_items (user_id, content)
        VALUES ($1, $2)
      `, [uid, content]);
    }
    console.log(`  Mind Log items: ${thoughts.length}`);

    // ── Journal (today) ───────────────────────────────
    const today = new Date().toISOString().split('T')[0];
    await pool.query(`
      INSERT INTO journal_entries (user_id, entry_date, body, mood, energy)
      VALUES ($1, $2, 'Solid day — shipped the Mind Log pagination. Feeling productive.', 7, 8)
      ON CONFLICT (user_id, entry_date) DO NOTHING
    `, [uid, today]);
    console.log('  Journal: 1 entry');

    // ── Health (today) ────────────────────────────────
    await pool.query(`
      INSERT INTO health_logs (user_id, log_date, sleep_hours, sleep_quality, metadata)
      VALUES ($1, $2, 7.5, 4, '{"activity_level": 65, "performance_note": "Good gym session, hit a PR on deadlift."}')
      ON CONFLICT (user_id, log_date) DO NOTHING
    `, [uid, today]);
    console.log('  Health: 1 log');

    console.log('\nDone! Login with:');
    console.log('  email:    demo@canopy.app');
    console.log('  password: canopy123');
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed();
