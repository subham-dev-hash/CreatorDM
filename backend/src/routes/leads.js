const express = require('express');
const leadService = require('../services/leadService');
const { auth } = require('../middleware/auth');
const { success, error, paginated } = require('../utils/apiResponse');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const result = await leadService.getLeads(req.user._id, req.query);
    return paginated(res, result.leads, result.page, result.limit, result.total);
  } catch (err) { next(err); }
});

router.get('/stats', auth, async (req, res, next) => {
  try {
    const stats = await leadService.getLeadStats(req.user._id);
    return success(res, stats);
  } catch (err) { next(err); }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const result = await leadService.getLeadById(req.user._id, req.params.id);
    if (!result) return error(res, 'Lead not found.', 404);
    return success(res, result);
  } catch (err) { next(err); }
});

router.post('/', auth, async (req, res, next) => {
  try {
    const lead = await leadService.createLead(req.user._id, req.body);
    return success(res, lead, 201);
  } catch (err) { next(err); }
});

router.put('/:id', auth, async (req, res, next) => {
  try {
    const lead = await leadService.updateLead(req.user._id, req.params.id, req.body);
    if (!lead) return error(res, 'Lead not found.', 404);
    return success(res, lead);
  } catch (err) { next(err); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const result = await leadService.deleteLead(req.user._id, req.params.id);
    if (!result) return error(res, 'Lead not found.', 404);
    return success(res, null);
  } catch (err) { next(err); }
});

module.exports = router;
