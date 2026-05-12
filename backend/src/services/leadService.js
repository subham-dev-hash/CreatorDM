const Lead = require('../models/Lead');
const MessageLog = require('../models/MessageLog');
const { PAGINATION } = require('../config/constants');
const logger = require('../config/logger');

class LeadService {
  async getLeads(userId, { page, limit, status, tag, source, search }) {
    const p = parseInt(page, 10) || PAGINATION.DEFAULT_PAGE;
    const l = Math.min(parseInt(limit, 10) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
    const skip = (p - 1) * l;

    const filter = { userId };
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (tag) filter.tags = { $in: [tag.toLowerCase()] };
    if (search) {
      filter.$or = [
        { instagramUsername: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ lastInteraction: -1 })
        .skip(skip)
        .limit(l)
        .populate('sourceAutomationId', 'name')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    return { leads, total, page: p, limit: l };
  }

  async getLeadById(userId, leadId) {
    const lead = await Lead.findOne({ _id: leadId, userId })
      .populate('sourceAutomationId', 'name')
      .populate('campaignEnrollments.campaignId', 'name status');

    if (!lead) return null;

    // Get message history
    const messages = await MessageLog.find({ leadId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return { lead, messages };
  }

  async createLead(userId, data) {
    const lead = await Lead.create({ userId, ...data });
    logger.info(`Lead created manually: ${lead._id}`);
    return lead;
  }

  async updateLead(userId, leadId, updates) {
    const lead = await Lead.findOneAndUpdate(
      { _id: leadId, userId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    return lead;
  }

  async deleteLead(userId, leadId) {
    const result = await Lead.findOneAndDelete({ _id: leadId, userId });
    if (result) {
      await MessageLog.deleteMany({ leadId });
    }
    return result;
  }

  async getLeadStats(userId) {
    const stats = await Lead.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = { total: 0, new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 };
    stats.forEach((s) => {
      result[s._id] = s.count;
      result.total += s.count;
    });

    return result;
  }
}

module.exports = new LeadService();
