const crypto = require('crypto');
const logger = require('../config/logger');
const { error } = require('../utils/apiResponse');

const validateWebhookSignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];

  if (!signature) {
    logger.warn('Webhook received without signature header');
    return error(res, 'Missing signature.', 403);
  }

  const appSecret = process.env.META_APP_SECRET;
  if (!appSecret) {
    logger.error('META_APP_SECRET not configured');
    return error(res, 'Server configuration error.', 500);
  }

  const rawBody = req.rawBody;
  if (!rawBody) {
    logger.error('Raw body not available for signature verification');
    return error(res, 'Unable to verify signature.', 500);
  }

  const expectedSignature =
    'sha256=' +
    crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  if (!isValid) {
    logger.warn('Webhook signature verification failed');
    return error(res, 'Invalid signature.', 403);
  }

  next();
};

module.exports = { validateWebhookSignature };
