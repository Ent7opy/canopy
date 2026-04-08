function errorHandler(err, req, res, next) {
  console.error(err.stack || err.message);

  if (err.status && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }

  res.status(500).json({ error: 'Internal server error' });
}

module.exports = { errorHandler };
