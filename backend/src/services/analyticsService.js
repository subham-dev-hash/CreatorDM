const mongoose = require('mongoose');
const Lead = require('../models/Lead');
const MessageLog = require('../models/MessageLog');
const Automation = require('../models/Automation');
const DripCampaign = require('../models/DripCampaign');

class AnalyticsService {
  async getOverview(userId) {
    const uid = new mongoose.Types.ObjectId(userId);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [leadStats, messageStats, automationStats, campaignStats] = await Promise.all([
      Lead.aggregate([
        { $match: { userId: uid } },
        { $facet: {
            total: [{ $count: 'count' }],
            newMonth: [{ $match: { createdAt: { $gte: thirtyDaysAgo } } }, { $count: 'count' }],
            byStatus: [{ $group: { _id: '$status', count: { $sum: 1 } } }],
          },
        },
      ]),
      MessageLog.aggregate([
        { $match: { userId: uid, createdAt: { $gte: thirtyDaysAgo } } },
        { $facet: {
            total: [{ $count: 'count' }],
            sent: [{ $match: { status: 'sent' } }, { $count: 'count' }],
            failed: [{ $match: { status: 'failed' } }, { $count: 'count' }],
          },
        },
      ]),
      Automation.aggregate([
        { $match: { userId: uid } },
        { $facet: {
            total: [{ $count: 'count' }],
            active: [{ $match: { status: 'active' } }, { $count: 'count' }],
            triggered: [{ $group: { _id: null, sum: { $sum: '$stats.triggered' } } }],
          },
        },
      ]),
      DripCampaign.aggregate([
        { $match: { userId: uid } },
        { $facet: {
            total: [{ $count: 'count' }],
            active: [{ $match: { status: 'active' } }, { $count: 'count' }],
            enrolled: [{ $group: { _id: null, sum: { $sum: '$enrolledCount' } } }],
          },
        },
      ]),
    ]);

    return {
      leads: { total: leadStats[0]?.total[0]?.count || 0, newThisMonth: leadStats[0]?.newMonth[0]?.count || 0, byStatus: leadStats[0]?.byStatus || [] },
      messages: { total: messageStats[0]?.total[0]?.count || 0, sent: messageStats[0]?.sent[0]?.count || 0, failed: messageStats[0]?.failed[0]?.count || 0 },
      automations: { total: automationStats[0]?.total[0]?.count || 0, active: automationStats[0]?.active[0]?.count || 0, totalTriggered: automationStats[0]?.triggered[0]?.sum || 0 },
      campaigns: { total: campaignStats[0]?.total[0]?.count || 0, active: campaignStats[0]?.active[0]?.count || 0, totalEnrolled: campaignStats[0]?.enrolled[0]?.sum || 0 },
    };
  }

  async getTimeline(userId, days = 30) {
    const uid = new mongoose.Types.ObjectId(userId);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [messageTimeline, leadTimeline] = await Promise.all([
      MessageLog.aggregate([
        { $match: { userId: uid, createdAt: { $gte: startDate }, direction: 'outbound' } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, sent: { $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] } }, failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }, total: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Lead.aggregate([
        { $match: { userId: uid, createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    return { messageTimeline, leadTimeline };
  }

  async getAutomationPerformance(userId) {
    return Automation.find({ userId }).select('name status stats createdAt').sort({ 'stats.triggered': -1 }).lean();
  }

  async getCampaignStats(userId) {
    const campaigns = await DripCampaign.find({ userId }).select('name status steps enrolledCount completedCount droppedCount createdAt').sort({ createdAt: -1 }).lean();
    return campaigns.map((c) => ({ ...c, stepsCount: c.steps.length, completionRate: c.enrolledCount > 0 ? ((c.completedCount / c.enrolledCount) * 100).toFixed(1) : 0 }));
  }
}

module.exports = new AnalyticsService();
