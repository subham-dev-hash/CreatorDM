const subscriptionService = require('../services/subscriptionService');
const logger = require('../config/logger');

const handleCashfreeWebhook = async (body) => {
  const { type, data } = body;

  logger.info(`Cashfree webhook received: ${type}`);

  switch (type) {
    case 'SUBSCRIPTION_PAYMENT_SUCCESS':
    case 'SUBSCRIPTION_PAYMENT_FAILURE':
      await subscriptionService.handlePaymentWebhook(data);
      break;
    case 'SUBSCRIPTION_STATUS_CHANGE':
      logger.info(`Subscription status changed: ${data.subscription_id} -> ${data.subscription_status}`);
      break;
    default:
      logger.info(`Unhandled Cashfree event: ${type}`);
  }
};

module.exports = { handleCashfreeWebhook };
