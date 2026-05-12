require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const { initQueues } = require('./src/queues');
const { initCashfree } = require('./src/config/cashfree');
const logger = require('./src/config/logger');

const PORT = process.env.PORT || 3333;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize BullMQ queues
    try {
      initQueues();

      // Start workers
      const startDmWorker = require('./src/queues/workers/dmWorker');
      const startCommentReplyWorker = require('./src/queues/workers/commentReplyWorker');
      const startCampaignWorker = require('./src/queues/workers/campaignWorker');
      startDmWorker();
      startCommentReplyWorker();
      startCampaignWorker();
    } catch (err) {
      logger.warn('Redis/BullMQ not available. Queue features disabled.', err.message);
    }

    // Initialize Cashfree
    initCashfree();

    // Start Express
    app.listen(PORT, () => {
      logger.info(`🚀 CreatorDM Backend running on port ${PORT}`);
      logger.info(`   Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`   Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (err) => { logger.error('Unhandled rejection:', err); });
process.on('uncaughtException', (err) => { logger.error('Uncaught exception:', err); process.exit(1); });

startServer();
