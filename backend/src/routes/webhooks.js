const express = require('express');
const { handleInstagramWebhook } = require('../webhooks/instagramHandler');
const { handleCashfreeWebhook } = require('../webhooks/cashfreeHandler');
const { validateWebhookSignature } = require('../middleware/webhookValidator');
const { webhookLimiter } = require('../middleware/rateLimiter');
const { success } = require('../utils/apiResponse');
const logger = require('../config/logger');

const router = express.Router();

// Meta webhook verification (GET)
router.get('/instagram', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    logger.info('Instagram webhook verified');
    return res.status(200).send(challenge);
  }
  return res.status(403).send('Forbidden');
});

// Meta webhook events (POST)
router.post('/instagram', webhookLimiter, validateWebhookSignature, async (req, res) => {
  // Always respond 200 immediately to Meta
  res.status(200).send('EVENT_RECEIVED');

  try {
    await handleInstagramWebhook(req.body);
  } catch (err) {
    logger.error('Instagram webhook processing error:', err);
  }
});

// Cashfree webhook
router.post('/cashfree', webhookLimiter, async (req, res) => {
  res.status(200).send('OK');
  try {
    await handleCashfreeWebhook(req.body);
  } catch (err) {
    logger.error('Cashfree webhook processing error:', err);
  }
});

module.exports = router;
