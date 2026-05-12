const { Worker } = require('bullmq');
const { createRedisConnection } = require('../../config/redis');
const { QUEUES } = require('../../config/constants');
const instagramService = require('../../services/instagramService');
const User = require('../../models/User');
const MessageLog = require('../../models/MessageLog');
const Automation = require('../../models/Automation');
const logger = require('../../config/logger');

const startDmWorker = () => {
  const connection = createRedisConnection('dm-worker');

  const worker = new Worker(
    QUEUES.DM,
    async (job) => {
      const { userId, recipientId, message, automationId, leadId, campaignId } = job.data;
      logger.info(`Processing DM job ${job.id} for user ${userId}`);

      const user = await User.findById(userId);
      if (!user || !user.instagram.accessToken) {
        throw new Error('User not found or Instagram not connected');
      }

      const result = await instagramService.sendDirectMessage(
        user.instagram.accountId, recipientId, message, user.instagram.accessToken
      );

      // Update message log
      await MessageLog.findOneAndUpdate(
        { userId, leadId, automationId: automationId || undefined, campaignId: campaignId || undefined, status: 'queued' },
        { status: 'sent', instagramMessageId: result.messageId },
        { sort: { createdAt: -1 } }
      );

      // Update automation stats
      if (automationId) {
        await Automation.findByIdAndUpdate(automationId, { $inc: { 'stats.sent': 1 } });
      }

      return result;
    },
    { connection, concurrency: 5, limiter: { max: 10, duration: 1000 } }
  );

  worker.on('completed', (job) => { logger.info(`DM job ${job.id} completed`); });
  worker.on('failed', async (job, err) => {
    logger.error(`DM job ${job.id} failed: ${err.message}`);
    if (job.data.automationId) {
      await Automation.findByIdAndUpdate(job.data.automationId, { $inc: { 'stats.failed': 1 } });
    }
    await MessageLog.findOneAndUpdate(
      { userId: job.data.userId, leadId: job.data.leadId, status: 'queued' },
      { status: 'failed', errorDetails: { message: err.message } },
      { sort: { createdAt: -1 } }
    );
  });

  logger.info('DM Worker started');
  return worker;
};

module.exports = startDmWorker;
