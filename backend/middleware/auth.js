const jwt = require('jsonwebtoken');

/**
 * Protects routes by verifying the Bearer JWT in the Authorization header.
 * On success, attaches decoded payload to `req.user` and calls next().
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'] ?? '';

  if (!authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
