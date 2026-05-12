const DripCampaign = require('../models/DripCampaign');
const Lead = require('../models/Lead');
const MessageLog = require('../models/MessageLog');
const { getQueues } = require('../queues');
const { JOB_DEFAULTS } = require('../config/constants');
const logger = require('../config/logger');

class CampaignService {
  /**
   * Enroll a lead into a drip campaign
   */
  async enrollLead(campaignId, leadId) {
    const campaign = await DripCampaign.findById(campaignId);
    if (!campaign || campaign.status !== 'active') {
      throw new Error('Campaign not found or not active');
    }

    const lead = await Lead.findById(leadId);
    if (!lead) throw new Error('Lead not found');

    // Check if already enrolled
    const existingEnrollment = lead.campaignEnrollments.find(
      (e) => e.campaignId.toString() === campaignId.toString() && e.status === 'active'
    );

    if (existingEnrollment) {
      logger.warn(`Lead ${leadId} already enrolled in campaign ${campaignId}`);
      return lead;
    }

    // Add enrollment
    lead.campaignEnrollments.push({
      campaignId,
      currentStep: 0,
      enrolledAt: new Date(),
    });
    await lead.save();

    // Update campaign count
    await DripCampaign.findByIdAndUpdate(campaignId, {
      $inc: { enrolledCount: 1 },
    });

    // Schedule first step
    if (campaign.steps.length > 0) {
      await this.scheduleStep(campaign, lead, 0);
    }

    logger.info(`Lead ${leadId} enrolled in campaign ${campaignId}`);
    return lead;
  }

  /**
   * Schedule a campaign step job
   */
  async scheduleStep(campaign, lead, stepIndex) {
    if (stepIndex >= campaign.steps.length) {
      return this.completeCampaignForLead(campaign._id, lead._id);
    }

    const step = campaign.steps[stepIndex];
    const { campaignStepQueue } = getQueues();

    await campaignStepQueue.add(
      'process-step',
      {
        campaignId: campaign._id.toString(),
        leadId: lead._id.toString(),
        userId: campaign.userId.toString(),
        stepIndex,
        message: step.content,
      },
      {
        ...JOB_DEFAULTS,
        delay: step.delayMinutes * 60 * 1000,
        jobId: `campaign-${campaign._id}-lead-${lead._id}-step-${stepIndex}`,
      }
    );
  }

  /**
   * Process a campaign step (called by worker)
   */
  async processStep({ campaignId, leadId, userId, stepIndex, message }) {
    const campaign = await DripCampaign.findById(campaignId);
    if (!campaign || campaign.status !== 'active') {
      logger.info(`Campaign ${campaignId} is no longer active, skipping step`);
      return;
    }

    const lead = await Lead.findById(leadId);
    if (!lead) return;

    const enrollment = lead.campaignEnrollments.find(
      (e) => e.campaignId.toString() === campaignId && e.status === 'active'
    );
    if (!enrollment) return;

    // Queue the DM
    const { dmQueue } = getQueues();
    await dmQueue.add(
      'send-dm',
      {
        userId,
        leadId: leadId.toString(),
        campaignId: campaignId.toString(),
        recipientId: lead.instagramUserId,
        message,
      },
      JOB_DEFAULTS
    );

    // Create message log
    await MessageLog.create({
      userId,
      leadId,
      campaignId,
      direction: 'outbound',
      messageType: 'dm',
      content: message,
      status: 'queued',
    });

    // Advance step
    enrollment.currentStep = stepIndex + 1;
    await lead.save();

    // Schedule next step
    await this.scheduleStep(campaign, lead, stepIndex + 1);
  }

  /**
   * Mark campaign as completed for a lead
   */
  async completeCampaignForLead(campaignId, leadId) {
    const lead = await Lead.findById(leadId);
    if (!lead) return;

    const enrollment = lead.campaignEnrollments.find(
      (e) => e.campaignId.toString() === campaignId.toString()
    );
    if (enrollment) {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
      await lead.save();
    }

    await DripCampaign.findByIdAndUpdate(campaignId, {
      $inc: { completedCount: 1 },
    });

    logger.info(`Lead ${leadId} completed campaign ${campaignId}`);
  }
}

module.exports = new CampaignService();
