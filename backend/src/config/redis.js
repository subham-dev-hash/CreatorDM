const Redis = require('ioredis');
const logger = require('./logger');

const createRedisConnection = (name = 'default') => {
  const connection = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,  // Required for BullMQ
    retryStrategy(times) {
      const delay = Math.min(times * 500, 5000);
      logger.warn(`Redis ${name}: Reconnecting in ${delay}ms (attempt ${times})`);
      return delay;
    },
    reconnectOnError(err) {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
  });

  connection.on('connect', () => {
    logger.info(`Redis ${name}: Connected`);
  });

  connection.on('error', (err) => {
    logger.error(`Redis ${name}: Error - ${err.message}`);
  });

  connection.on('close', () => {
    logger.warn(`Redis ${name}: Connection closed`);
  });

  return connection;
};

// Shared connection for general use
let sharedConnection = null;

const getRedisConnection = () => {
  if (!sharedConnection) {
    sharedConnection = createRedisConnection('shared');
  }
  return sharedConnection;
};

module.exports = { createRedisConnection, getRedisConnection };
