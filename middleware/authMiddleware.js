// middleware to verify JWT and populate req.user
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function authMiddleware(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return next(); // allow unauthenticated on some routes; handlers check req.user
  const parts = String(auth).split(' ');
  if (parts.length !== 2) return next();
  const token = parts[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
  } catch (err) {
    // invalid token -> ignore user (route handlers will return 401/403)
    console.warn('Invalid token:', err.message);
  }
  next();
}

module.exports = authMiddleware;
