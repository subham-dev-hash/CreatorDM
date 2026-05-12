const express = require('express');
const analyticsService = require('../services/analyticsService');
const { auth } = require('../middleware/auth');
const { success } = require('../utils/apiResponse');

const router = express.Router();

router.get('/overview', auth, async (req, res, next) => {
  try {
    const data = await analyticsService.getOverview(req.user._id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.get('/timeline', auth, async (req, res, next) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const data = await analyticsService.getTimeline(req.user._id, days);
    return success(res, data);
  } catch (err) { next(err); }
});

router.get('/automations', auth, async (req, res, next) => {
  try {
    const data = await analyticsService.getAutomationPerformance(req.user._id);
    return success(res, data);
  } catch (err) { next(err); }
});

router.get('/campaigns', auth, async (req, res, next) => {
  try {
    const data = await analyticsService.getCampaignStats(req.user._id);
    return success(res, data);
  } catch (err) { next(err); }
});

module.exports = router;
