const { Worker } = require('bullmq');
const { createRedisConnection } = require('../../config/redis');
const { QUEUES } = require('../../config/constants');
const instagramService = require('../../services/instagramService');
const User = require('../../models/User');
const logger = require('../../config/logger');

const startCommentReplyWorker = () => {
  const connection = createRedisConnection('comment-reply-worker');

  const worker = new Worker(
    QUEUES.COMMENT_REPLY,
    async (job) => {
      const { userId, commentId, message } = job.data;
      logger.info(`Processing comment reply job ${job.id}`);

      const user = await User.findById(userId);
      if (!user || !user.instagram.accessToken) {
        throw new Error('User not found or Instagram not connected');
      }

      return instagramService.replyToComment(commentId, message, user.instagram.accessToken);
    },
    { connection, concurrency: 3, limiter: { max: 5, duration: 1000 } }
  );

  worker.on('completed', (job) => { logger.info(`Comment reply job ${job.id} completed`); });
  worker.on('failed', (job, err) => { logger.error(`Comment reply job ${job.id} failed: ${err.message}`); });

  logger.info('Comment Reply Worker started');
  return worker;
};

module.exports = startCommentReplyWorker;
