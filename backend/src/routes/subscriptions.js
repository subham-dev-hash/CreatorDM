const express = require('express');
const subscriptionService = require('../services/subscriptionService');
const { auth } = require('../middleware/auth');
const { success, error } = require('../utils/apiResponse');

const router = express.Router();

router.get('/plans', async (req, res) => {
  const plans = subscriptionService.getPlans();
  return success(res, plans);
});

router.post('/create', auth, async (req, res, next) => {
  try {
    const { planKey } = req.body;
    if (!planKey) return error(res, 'Plan key required.', 400);
    const result = await subscriptionService.createSubscription(req.user._id, planKey);
    return success(res, result, 201);
  } catch (err) { next(err); }
});

router.get('/status', auth, async (req, res, next) => {
  try {
    const sub = await subscriptionService.getSubscriptionStatus(req.user._id);
    return success(res, sub);
  } catch (err) { next(err); }
});

router.post('/cancel', auth, async (req, res, next) => {
  try {
    const { reason } = req.body;
    const sub = await subscriptionService.cancelSubscription(req.user._id, reason);
    return success(res, sub);
  } catch (err) { next(err); }
});

module.exports = router;
