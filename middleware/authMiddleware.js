const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');

exports.protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('⛔ No token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Caching tip (can skip DB hit if user info is encoded in token)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      logger.warn('⛔ Token valid but user not found');
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    next();
  } catch (err) {
    logger.error(`⛔ JWT Error: ${err.name} - ${err.message}`);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
