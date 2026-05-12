const { Worker } = require('bullmq');
const { createRedisConnection } = require('../../config/redis');
const { QUEUES } = require('../../config/constants');
const campaignService = require('../../services/campaignService');
const logger = require('../../config/logger');

const startCampaignWorker = () => {
  const connection = createRedisConnection('campaign-worker');

  const worker = new Worker(
    QUEUES.CAMPAIGN_STEP,
    async (job) => {
      logger.info(`Processing campaign step job ${job.id}`);
      await campaignService.processStep(job.data);
    },
    { connection, concurrency: 5 }
  );

  worker.on('completed', (job) => { logger.info(`Campaign step job ${job.id} completed`); });
  worker.on('failed', (job, err) => { logger.error(`Campaign step job ${job.id} failed: ${err.message}`); });

  logger.info('Campaign Worker started');
  return worker;
};

module.exports = startCampaignWorker;
