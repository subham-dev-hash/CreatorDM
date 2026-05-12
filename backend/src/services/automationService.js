const Automation = require('../models/Automation');
const Lead = require('../models/Lead');
const MessageLog = require('../models/MessageLog');
const { getQueues } = require('../queues');
const { JOB_DEFAULTS } = require('../config/constants');
const logger = require('../config/logger');

class AutomationService {
  /**
   * Process incoming comment against user's automations
   */
  async processComment({ userId, commentText, commenterId, commentId, mediaId }) {
    try {
      // Find all active automations for this user
      const automations = await Automation.find({
        userId,
        status: 'active',
      });

      if (!automations.length) {
        logger.debug(`No active automations for user ${userId}`);
        return;
      }

      for (const automation of automations) {
        const isMatch = this.matchesAutomation(automation, commentText, mediaId);
        if (!isMatch) continue;

        logger.info(`Automation "${automation.name}" matched comment ${commentId}`);

        // Create or update lead
        const lead = await this.upsertLead({
          userId,
          instagramUserId: commenterId,
          automationId: automation._id,
        });

        // Queue DM
        const { dmQueue, commentReplyQueue } = getQueues();

        await dmQueue.add(
          'send-dm',
          {
            userId: userId.toString(),
            automationId: automation._id.toString(),
            leadId: lead._id.toString(),
            recipientId: commenterId,
            message: automation.response.content,
          },
          {
            ...JOB_DEFAULTS,
            jobId: `dm-${commentId}-${automation._id}`, // Prevent duplicates
          }
        );

        // Queue public reply if enabled
        if (automation.publicReply.enabled) {
          await commentReplyQueue.add(
            'reply-comment',
            {
              userId: userId.toString(),
              commentId,
              message: automation.publicReply.text,
            },
            {
              ...JOB_DEFAULTS,
              jobId: `reply-${commentId}-${automation._id}`,
            }
          );
        }

        // Update stats
        await Automation.findByIdAndUpdate(automation._id, {
          $inc: { 'stats.triggered': 1 },
        });

        // Create message log
        await MessageLog.create({
          userId,
          leadId: lead._id,
          automationId: automation._id,
          direction: 'outbound',
          messageType: 'dm',
          content: automation.response.content,
          status: 'queued',
          metadata: { commentId, mediaId },
        });
      }
    } catch (error) {
      logger.error('Error processing comment:', error);
      throw error;
    }
  }

  /**
   * Check if a comment matches an automation's triggers
   */
  matchesAutomation(automation, commentText, mediaId) {
    // Check media target filter
    if (
      automation.targetMediaIds.length > 0 &&
      !automation.targetMediaIds.includes(mediaId)
    ) {
      return false;
    }

    // Match by trigger type
    if (automation.triggerType === 'any_comment') {
      return true;
    }

    if (automation.triggerType === 'comment_keyword') {
      const lowerComment = commentText.toLowerCase();
      return automation.keywords.some((keyword) =>
        lowerComment.includes(keyword.toLowerCase())
      );
    }

    return false;
  }

  /**
   * Create or update a lead from a comment interaction
   */
  async upsertLead({ userId, instagramUserId, automationId }) {
    let lead = await Lead.findOne({ userId, instagramUserId });

    if (lead) {
      lead.lastInteraction = new Date();
      lead.engagementScore += 1;
      if (lead.status === 'new') lead.status = 'contacted';
      await lead.save();
    } else {
      lead = await Lead.create({
        userId,
        instagramUserId,
        source: 'comment',
        sourceAutomationId: automationId,
        status: 'new',
      });
    }

    return lead;
  }
}

module.exports = new AutomationService();
