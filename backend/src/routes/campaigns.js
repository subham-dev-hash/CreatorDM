const express = require('express');
const Joi = require('joi');
const DripCampaign = require('../models/DripCampaign');
const campaignService = require('../services/campaignService');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { success, error, paginated } = require('../utils/apiResponse');
const { PAGINATION } = require('../config/constants');

const router = express.Router();

const campaignSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  steps: Joi.array().items(Joi.object({ order: Joi.number().required(), delayMinutes: Joi.number().min(0).required(), messageType: Joi.string().valid('text', 'template').default('text'), content: Joi.string().max(1000).required() })).min(1).required(),
  triggerAutomationId: Joi.string().allow(null).default(null),
});

router.get('/', auth, async (req, res, next) => {
  try {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, status } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [campaigns, total] = await Promise.all([
      DripCampaign.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).populate('triggerAutomationId', 'name').lean(),
      DripCampaign.countDocuments(filter),
    ]);
    return paginated(res, campaigns, page, limit, total);
  } catch (err) { next(err); }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const campaign = await DripCampaign.findOne({ _id: req.params.id, userId: req.user._id }).populate('triggerAutomationId', 'name');
    if (!campaign) return error(res, 'Campaign not found.', 404);
    return success(res, campaign);
  } catch (err) { next(err); }
});

router.post('/', auth, validate(campaignSchema), async (req, res, next) => {
  try {
    const campaign = await DripCampaign.create({ ...req.body, userId: req.user._id });
    return success(res, campaign, 201);
  } catch (err) { next(err); }
});

router.put('/:id', auth, validate(campaignSchema), async (req, res, next) => {
  try {
    const campaign = await DripCampaign.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true });
    if (!campaign) return error(res, 'Campaign not found.', 404);
    return success(res, campaign);
  } catch (err) { next(err); }
});

router.patch('/:id/toggle', auth, async (req, res, next) => {
  try {
    const campaign = await DripCampaign.findOne({ _id: req.params.id, userId: req.user._id });
    if (!campaign) return error(res, 'Campaign not found.', 404);
    campaign.status = campaign.status === 'active' ? 'paused' : 'active';
    await campaign.save();
    return success(res, campaign);
  } catch (err) { next(err); }
});

router.post('/:id/enroll', auth, async (req, res, next) => {
  try {
    const { leadIds } = req.body;
    if (!leadIds || !leadIds.length) return error(res, 'Lead IDs required.', 400);
    const results = [];
    for (const leadId of leadIds) {
      const lead = await campaignService.enrollLead(req.params.id, leadId);
      results.push(lead);
    }
    return success(res, results);
  } catch (err) { next(err); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const result = await DripCampaign.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return error(res, 'Campaign not found.', 404);
    return success(res, null);
  } catch (err) { next(err); }
});

module.exports = router;
