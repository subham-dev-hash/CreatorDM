const { Queue } = require('bullmq');
const { createRedisConnection } = require('../config/redis');
const { QUEUES } = require('../config/constants');
const logger = require('../config/logger');

let queues = {};

const initQueues = () => {
  const connection = createRedisConnection('queues');

  queues.dmQueue = new Queue(QUEUES.DM, { connection, defaultJobOptions: { removeOnComplete: { count: 1000 }, removeOnFail: { count: 5000 } } });
  queues.commentReplyQueue = new Queue(QUEUES.COMMENT_REPLY, { connection, defaultJobOptions: { removeOnComplete: { count: 1000 }, removeOnFail: { count: 5000 } } });
  queues.campaignStepQueue = new Queue(QUEUES.CAMPAIGN_STEP, { connection, defaultJobOptions: { removeOnComplete: { count: 1000 }, removeOnFail: { count: 5000 } } });

  logger.info('BullMQ queues initialized');
  return queues;
};

const getQueues = () => queues;

module.exports = { initQueues, getQueues };
