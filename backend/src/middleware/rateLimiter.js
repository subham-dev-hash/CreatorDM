const rateLimit = require('express-rate-limit');
const { RATE_LIMIT } = require('../config/constants');
const logger = require('../config/logger');

const createRateLimiter = (config = RATE_LIMIT.GENERAL) => {
  return rateLimit({
    windowMs: config.windowMs,
    max: config.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests. Please try again later.',
    },
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
      res.status(429).json(options.message);
    },
  });
};

const generalLimiter = createRateLimiter(RATE_LIMIT.GENERAL);
const authLimiter = createRateLimiter(RATE_LIMIT.AUTH);
const webhookLimiter = createRateLimiter(RATE_LIMIT.WEBHOOK);

module.exports = { createRateLimiter, generalLimiter, authLimiter, webhookLimiter };
