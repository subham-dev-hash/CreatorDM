const express = require('express');
const Joi = require('joi');
const Automation = require('../models/Automation');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { success, error, paginated } = require('../utils/apiResponse');
const { PAGINATION } = require('../config/constants');

const router = express.Router();

const automationSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  triggerType: Joi.string().valid('comment_keyword', 'any_comment').required(),
  keywords: Joi.array().items(Joi.string().trim()).default([]),
  targetMediaIds: Joi.array().items(Joi.string()).default([]),
  response: Joi.object({ type: Joi.string().valid('text', 'template').default('text'), content: Joi.string().max(1000).required(), buttons: Joi.array().items(Joi.object({ title: Joi.string().max(30), url: Joi.string().uri() })).default([]) }).required(),
  publicReply: Joi.object({ enabled: Joi.boolean().default(false), text: Joi.string().max(300).default('Check your DMs! 📩') }).default(),
});

// List automations
router.get('/', auth, async (req, res, next) => {
  try {
    const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT, status } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    const skip = (page - 1) * limit;
    const [automations, total] = await Promise.all([
      Automation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
      Automation.countDocuments(filter),
    ]);
    return paginated(res, automations, page, limit, total);
  } catch (err) { next(err); }
});

// Get single automation
router.get('/:id', auth, async (req, res, next) => {
  try {
    const automation = await Automation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!automation) return error(res, 'Automation not found.', 404);
    return success(res, automation);
  } catch (err) { next(err); }
});

// Create automation
router.post('/', auth, validate(automationSchema), async (req, res, next) => {
  try {
    const automation = await Automation.create({ ...req.body, userId: req.user._id });
    return success(res, automation, 201);
  } catch (err) { next(err); }
});

// Update automation
router.put('/:id', auth, validate(automationSchema), async (req, res, next) => {
  try {
    const automation = await Automation.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true, runValidators: true });
    if (!automation) return error(res, 'Automation not found.', 404);
    return success(res, automation);
  } catch (err) { next(err); }
});

// Toggle automation status
router.patch('/:id/toggle', auth, async (req, res, next) => {
  try {
    const automation = await Automation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!automation) return error(res, 'Automation not found.', 404);
    automation.status = automation.status === 'active' ? 'paused' : 'active';
    await automation.save();
    return success(res, automation);
  } catch (err) { next(err); }
});

// Delete automation
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const result = await Automation.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return error(res, 'Automation not found.', 404);
    return success(res, null, 200);
  } catch (err) { next(err); }
});

module.exports = router;
