const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { pool } = require('../db/pool');

async function requireAuth(req, res, next) {
  const token =
    req.cookies?.canopy_session ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT token_invalidated_before FROM users WHERE id = $1',
      [decoded.id]
    );
    if (!rows[0]) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (
      rows[0].token_invalidated_before &&
      decoded.iat < Math.floor(new Date(rows[0].token_invalidated_before).getTime() / 1000)
    ) {
      return res.status(401).json({ error: 'Token has been revoked. Please log in again.' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };
